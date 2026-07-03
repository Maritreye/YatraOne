import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { travellerOptions as TRAVELLER_OPTIONS, styleOptions as STYLE_OPTIONS, interests as INTERESTS, budgetChips as BUDGET_CHIPS, loadingTips as LOADING_TIPS } from "../data/aiItineraryOptions.json";
import { useAuth } from "../AuthContext";
import itineraryMock from "../data/itineraryResult.json";

const ACCOMMODATION_OPTIONS = ["Budget Hotels", "3 Star Hotels", "4-5 Star Hotels", "Homestays"];

// Rating range the AI is allowed to return for each accommodation tier.
// Used to correct the AI's output if it picks a rating outside the expected tier.
const ACCOMMODATION_RATING_RANGES = {
  "Budget Hotels": [2.5, 3.2],
  "3 Star Hotels": [3.0, 3.7],
  "4-5 Star Hotels": [4.0, 4.9],
  "Homestays": [3.5, 4.5],
};

function clampHotelRating(ratingRaw, accommodationPref) {
  const range = ACCOMMODATION_RATING_RANGES[accommodationPref] || [3.5, 4.5];
  const val = Number(ratingRaw);
  if (isNaN(val) || val < range[0] || val > range[1]) {
    return ((range[0] + range[1]) / 2).toFixed(1);
  }
  return val.toFixed(1);
}


function calcDays(start, end) {
  if (!start || !end) return null;
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.round((e - s) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : null;
}

function formatDate(dateStr, idx) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  d.setDate(d.getDate() + idx);
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AIItinerary() {
  const navigate = useNavigate();
  const { mongoUser } = useAuth();
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travellers, setTravellers] = useState("");
  const [budget, setBudget] = useState(15000);
  const [travelStyle, setTravelStyle] = useState("");
  const [interests, setInterests] = useState([]);
  const [notes, setNotes] = useState("");
  const [accommodation, setAccommodation] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const duration = calcDays(startDate, endDate);

  const toggleInterest = (item) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const validate = () => {
    const errs = {};
    if (!fromCity.trim()) errs.fromCity = "Please enter your departure city";
    if (!toCity.trim()) errs.toCity = "Please enter your destination";
    if (!startDate) errs.startDate = "Please select a start date";
    if (!endDate) errs.endDate = "End date must be after start date";
    else if (startDate && new Date(endDate) <= new Date(startDate))
      errs.endDate = "End date must be after start date";
    if (!travellers) errs.travellers = "Please select number of travellers";
    if (interests.length === 0) errs.interests = "Please select at least one interest";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const normalizeTrainInfo = (raw) => {
    if (!raw || typeof raw !== "object") return null;
    return {
      name: raw.name || raw.trainName || raw.train_name || null,
      departure: raw.departure || raw.schedule || raw.timings || null,
      class: raw.class || raw.travelClass || raw.travel_class || "Sleeper (SL)",
      pricePerPerson:
        raw.pricePerPerson != null ? raw.pricePerPerson :
        raw.price_per_person != null ? raw.price_per_person :
        raw.price != null ? raw.price :
        raw.fare != null ? raw.fare : null,
      returnDeparture:
        raw.returnDeparture || raw.return_departure || raw.returnJourney || null,
    };
  };

  const normalizeHotelInfo = (raw, fallbackNights) => {
    if (!raw || typeof raw !== "object") return null;
    return {
      name: raw.name || raw.hotelName || raw.hotel_name || null,
      rating: raw.rating || raw.stars || "4.0",
      location: raw.location || raw.address || toCity,
      pricePerNight:
        raw.pricePerNight != null ? raw.pricePerNight :
        raw.price_per_night != null ? raw.price_per_night :
        raw.price != null ? raw.price :
        raw.rate != null ? raw.rate : null,
      nights:
        raw.nights != null ? raw.nights :
        raw.numberOfNights != null ? raw.numberOfNights :
        fallbackNights,
      rooms: raw.rooms != null ? raw.rooms : 1,
      amenities:
        Array.isArray(raw.amenities) && raw.amenities.length > 0
          ? raw.amenities
          : ["WiFi", "AC", "Breakfast", "Parking"],
    };
  };

  // Build mock days with real dates from user input
  const buildMockDaysWithRealDates = () => {
    return itineraryMock.days.map((day, idx) => {
      const label = formatDate(startDate, idx);

      // Patch each activity — fix any Train activities that have wrong cities
      const patchedActivities = (day.activities || []).map((activity) => {
        if (activity.type === "Train") {
          return {
            ...activity,
            name: `Board Train — ${fromCity} to ${toCity}`,
            desc: `${fromCity} Jn → ${toCity} Jn`,
          };
        }
        if (activity.type === "Travel" && activity.name?.toLowerCase().includes("arrive")) {
          return {
            ...activity,
            name: `Arrive at ${toCity}`,
            desc: `Check into hotel after arrival in ${toCity}`,
          };
        }
        return activity;
      });

      return {
        ...day,
        date: `Day ${day.day} - ${label}`,
        activities: patchedActivities,
      };
    });
  };

  const buildRealisticExpenses = (totalBudget, nights, travellerCount) => {
    const trainCost     = Math.round(totalBudget * 0.08);
    const hotelCost     = Math.round(totalBudget * 0.30);
    const foodCost      = Math.round(totalBudget * 0.22);
    const entryCost     = Math.round(totalBudget * 0.10);
    const transportCost = Math.round(totalBudget * 0.08);
    const shoppingCost  = Math.round(totalBudget * 0.14);
    const miscCost      = Math.round(totalBudget * 0.08);

    return [
      { label: `Train tickets (${travellerCount}x)`, amount: trainCost,      color: "#2563EB" },
      { label: `Hotel (${nights} nights)`,            amount: hotelCost,      color: "#0F766E" },
      { label: "Food & dining",                       amount: foodCost,       color: "#F59E0B" },
      { label: "Entry fees",                          amount: entryCost,      color: "#8B5CF6" },
      { label: "Local transport",                     amount: transportCost,  color: "#64748B" },
      { label: "Shopping",                            amount: shoppingCost,   color: "#EC4899" },
      { label: "Miscellaneous",                       amount: miscCost,       color: "#94A3B8" },
    ];
  };

  const handleGenerate = async () => {
    if (!validate()) return;
    setLoading(true);

    const hotelNights = duration - 1 > 0 ? duration - 1 : 1;
    const selectedTravellerOption = TRAVELLER_OPTIONS.find((opt) => opt.id === travellers);
    const headcount = selectedTravellerOption?.count ?? 2;
    const roomsNeeded = Math.max(1, Math.ceil(headcount / 2));

    try {
     const geminiRes = await fetch(
     "http://localhost:5000/api/ai/generate-itinerary",
     {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
     },
     body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      max_tokens: 4000,
      messages: [ 
              {
                role: "user",
                content: `You are a travel planner. Generate a detailed trip itinerary in JSON format ONLY.
Output MUST be valid JSON with NO markdown fences, NO explanation text before or after — just a raw JSON object starting with { and ending with }.

Trip details:
- From: ${fromCity}
- To: ${toCity}
- Start date: ${startDate}
- End date: ${endDate}
- Duration: ${duration} days
- Travellers: ${travellers} (${headcount} people total — ALL costs must be calculated for this many people, not per person)
- Budget: ₹${budget}
- Travel style: ${travelStyle || "balanced"}
- Interests: ${interests.join(", ")}
- Accommodation: ${accommodation || "3 Star Hotels"}
- Special notes: ${notes || "none"}
- Rooms needed: ${roomsNeeded} (based on ${headcount} traveller(s))

Return EXACTLY this JSON structure with ALL numeric fields as actual numbers (not strings):
{
  "destination": "${toCity}",
  "stats": ["${duration} Days", "1 Train", "1 Hotel", "8 Places"],
  "expenses": [
    { "label": "Train tickets (${headcount}x)", "amount": 1200, "color": "#2563EB" },
    { "label": "Hotel (${hotelNights} nights)", "amount": 4500, "color": "#0F766E" },
    { "label": "Food & dining", "amount": 2000, "color": "#F59E0B" },
    { "label": "Entry fees", "amount": 800, "color": "#8B5CF6" },
    { "label": "Local transport", "amount": 500, "color": "#64748B" },
    { "label": "Shopping", "amount": 1000, "color": "#EC4899" }
  ],
  "days": [
    {
      "day": 1,
      "date": "Day 1 - ${formatDate(startDate, 0)}",
      "activities": [
        {
          "time": "09:00 AM",
          "type": "Place",
          "name": "Actual famous place in ${toCity}",
          "desc": "Brief description",
          "duration": "2 hours",
          "cost": "₹200 per person",
          "action": null
        }
      ]
    }
  ],
  "weatherTrip": [
    { "date": "Day 1", "icon": "☀️", "condition": "Sunny", "temp": "32°C" }
  ],
  "tips": [
    { "icon": "💡", "text": "Useful travel tip specific to ${toCity}" }
  ],
  "trainInfo": {
    "name": "Real train name and number that travels from ${fromCity} to ${toCity}",
    "departure": "${fromCity} Jn (07:00) → ${toCity} Jn (14:30)",
    "class": "Sleeper (SL)",
    "pricePerPerson": 650,
    "returnDeparture": "${toCity} Jn (18:00) → ${fromCity} Jn (02:00+1)"
  },
  "hotelInfo": {
    "name": "Real popular hotel name in ${toCity}",
    "rating": "4.2",
    "location": "City centre, near main attractions in ${toCity}",
    "pricePerNight": 2500,
    "nights": ${hotelNights},
    "rooms": ${roomsNeeded},
    "amenities": ["WiFi", "AC", "Breakfast", "Parking"]
  }
}

CRITICAL RULES — MUST FOLLOW:
1. ALL train routes MUST go FROM "${fromCity}" TO "${toCity}" only. Do NOT use any other cities.
2. Day 1 date MUST be "${formatDate(startDate, 0)}", Day 2 is "${formatDate(startDate, 1)}", etc.
3. Every day card date MUST use the actual dates starting from ${startDate}.
4. Return ONLY raw JSON. No markdown fences. No backticks. No explanation. Start with { end with }.
5. All numeric values (amount, pricePerPerson, pricePerNight, nights, rooms) must be plain numbers, not strings.
6. The "trainInfo" field at root level is REQUIRED — do not omit it.
7. Tailor expenses to the ₹${budget} budget realistically.
8. hotelInfo.rating MUST match the "${accommodation || "3 Star Hotels"}" tier: Budget Hotels → 2.5–3.2, 3 Star Hotels → 3.0–3.7, 4-5 Star Hotels → 4.0–4.9, Homestays → 3.5–4.5. Never output a rating outside this range.
9. hotelInfo.pricePerNight is the cost for ONE ROOM for ONE NIGHT, not the total trip cost and not a per-person price. This trip needs ${roomsNeeded} room(s) for ${headcount} traveller(s) — set hotelInfo.rooms to ${roomsNeeded}.
10. The ₹${budget} budget is the TOTAL for the ENTIRE GROUP of ${headcount} traveller(s), not for one person. Every expense line item — train tickets, food & dining, entry fees, local transport, shopping — MUST be calculated for all ${headcount} traveller(s) combined (e.g. food & dining = per-person daily cost × ${headcount} people × ${duration} days), not for a single traveller. Label the train tickets line as "Train tickets (${headcount}x)".
11. The sum of all expense amounts should realistically use a meaningful share of the ₹${budget} total budget for a group of ${headcount} — do not drastically underspend as if planning for one person.`,
              },
            ],
          }),
        }
      );

      const geminiData = await geminiRes.json();
      console.log("Groq raw response:", JSON.stringify(geminiData, null, 2));
      const rawText = geminiData.choices?.[0]?.message?.content || "";

      // Strip markdown fences if the model wraps output with ```json ... ```
      const cleaned = rawText
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();
      console.log("Cleaned text (first 500 chars):", cleaned.slice(0, 500));
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in Groq response");

      const itineraryData = JSON.parse(jsonMatch[0]);

      // Ensure day dates use real user dates (override model output if it got them wrong)
      const daysWithRealDates = (itineraryData.days || []).map((day, idx) => ({
        ...day,
        date: `Day ${day.day} - ${formatDate(startDate, idx)}`,
      }));

      const trainInfo = normalizeTrainInfo(itineraryData.trainInfo);
      const rawHotelInfo = itineraryData.hotelInfo || {};
      rawHotelInfo.rating = clampHotelRating(rawHotelInfo.rating, accommodation || "3 Star Hotels");
      rawHotelInfo.rooms = roomsNeeded; // always trust our own calculation, not the AI's
      const hotelInfo = normalizeHotelInfo(rawHotelInfo, hotelNights);

      const saveRes = await fetch("http://localhost:5000/api/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: mongoUser._id,
          destination: toCity,
          preferences: {
            travellerType: travellers,
            style: travelStyle,
            interests,
            accommodation,
            budget,
          },
          stats: itineraryData.stats || [`${duration} Days`, "1 Train", "1 Hotel", "8 Places"],
          expenses: itineraryData.expenses,
          days: daysWithRealDates,
          weatherTrip: itineraryData.weatherTrip,
          tips: itineraryData.tips,
          trainInfo,
          hotelInfo,
        }),
      });

      const saved = await saveRes.json();
      setLoading(false);
      navigate(`/itinerary/result/${saved._id}`);
    } catch (err) {
      console.error("Groq or save failed:", err);

      const hotelNights = duration - 1 > 0 ? duration - 1 : 1;

      // Build fallback with REAL user data so nothing is hardcoded
      const mockDays = buildMockDaysWithRealDates();

      const mockTrainInfo = normalizeTrainInfo({
        name:
          itineraryMock.trainInfo?.name ||
          `Train from ${fromCity} to ${toCity}`,
        departure: `${fromCity} Jn → ${toCity} Jn (Check IRCTC for timings)`,
        class: itineraryMock.trainInfo?.class || "Sleeper (SL)",
        pricePerPerson: itineraryMock.trainInfo?.pricePerPerson || null,
        returnDeparture: `${toCity} Jn → ${fromCity} Jn (Check IRCTC for timings)`,
      });

      const mockHotelInfo = normalizeHotelInfo(
        {
          ...(itineraryMock.hotelInfo || {}),
          location: toCity,
          name: itineraryMock.hotelInfo?.name || `Hotel in ${toCity}`,
        },
        hotelNights
      );

      const saveRes = await fetch("http://localhost:5000/api/itineraries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: mongoUser._id,
          destination: toCity,
          preferences: {
            travellerType: travellers,
            style: travelStyle,
            interests,
            accommodation,
            budget,
          },
          stats: [`${duration} Days`, "1 Train", "1 Hotel", "8 Places"],
          expenses: buildRealisticExpenses(budget, hotelNights, headcount),
          days: mockDays,
          weatherTrip: itineraryMock.weatherTrip,
          tips: itineraryMock.tips,
          trainInfo: mockTrainInfo,
          hotelInfo: mockHotelInfo,
        }),
      });

      const saved = await saveRes.json();
      setLoading(false);
      navigate(`/itinerary/result/${saved._id}`);
    }
  };

  const inputStyle = (hasError) => ({
    width: "100%",
    height: "44px",
    border: `1px solid ${hasError ? "#EF4444" : "#E2E8F0"}`,
    borderRadius: "8px",
    padding: "0 14px 0 40px",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none",
  });

  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#F8FAFC" }}>
      {/* Navbar */}
      <div
        style={{
          width: "100%",
          height: "72px",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 80px",
          boxSizing: "border-box",
        }}
      >
        <div
          onClick={() => navigate("/")}
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: "22px",
            color: "#2563EB",
            cursor: "pointer",
          }}
        >
          YatraOne
        </div>
        <div style={{ display: "flex", gap: "28px" }}>
          {[
            { label: "Trains", path: "/trains" },
            { label: "Hotels", path: "/hotels" },
            { label: "Places", path: "/places" },
            { label: "Map", path: "/map" },
            { label: "AI Itinerary", path: "/itinerary" },
          ].map((item) => (
            <div
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: item.label === "AI Itinerary" ? "#2563EB" : "#475569",
                fontWeight: item.label === "AI Itinerary" ? 600 : 400,
                cursor: "pointer",
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div
        style={{
          width: "100%",
          minHeight: "200px",
          backgroundColor: "#1E293B",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          padding: "32px 24px 64px 24px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            backgroundColor: "#2563EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "22px",
            color: "#FFFFFF",
          }}
        >
          ✨
        </div>
        <div
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: "36px",
            color: "#FFFFFF",
            textAlign: "center",
          }}
        >
          AI Travel Planner
        </div>
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
          }}
        >
          Tell us about your trip and we'll plan everything for you
        </div>
      </div>

      {/* Form Card / Loading Card */}
      <div
        style={{
          maxWidth: "800px",
          margin: "-40px auto 0 auto",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "16px",
          padding: "40px",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              padding: "20px 0",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                border: "4px solid #E2E8F0",
                borderTopColor: "#2563EB",
                animation: "spin 1s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <div
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "18px",
                color: "#1E293B",
              }}
            >
              Creating your perfect itinerary...
            </div>
            <div
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "#64748B",
              }}
            >
              {LOADING_TIPS[1]}
            </div>
            <div style={{ width: "100%" }}>
              <div
                style={{
                  width: "100%",
                  height: "4px",
                  backgroundColor: "#E2E8F0",
                  borderRadius: "999px",
                }}
              >
                <div
                  style={{
                    width: "60%",
                    height: "4px",
                    backgroundColor: "#2563EB",
                    borderRadius: "999px",
                  }}
                />
              </div>
              <div
                style={{
                  textAlign: "right",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  color: "#2563EB",
                  marginTop: "6px",
                }}
              >
                60%
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: "22px",
                  color: "#1E293B",
                }}
              >
                Plan my trip
              </div>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  color: "#64748B",
                  marginTop: "4px",
                }}
              >
                Fill in your details and our AI will create a personalized itinerary
              </div>
            </div>

            {/* Row 1 - From/To */}
            <div style={{ display: "flex", gap: "20px", marginBottom: "24px" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                <label
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#1E293B",
                  }}
                >
                  Travelling from
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94A3B8",
                      fontSize: "14px",
                    }}
                  >
                    🚆
                  </span>
                  <input
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    placeholder="Enter city name"
                    style={inputStyle(errors.fromCity)}
                  />
                </div>
                {errors.fromCity && (
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      color: "#EF4444",
                    }}
                  >
                    {errors.fromCity}
                  </div>
                )}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                <label
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#1E293B",
                  }}
                >
                  Travelling to
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94A3B8",
                      fontSize: "14px",
                    }}
                  >
                    📍
                  </span>
                  <input
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    placeholder="Enter destination"
                    style={inputStyle(errors.toCity)}
                  />
                </div>
                {errors.toCity && (
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      color: "#EF4444",
                    }}
                  >
                    {errors.toCity}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2 - Dates */}
            <div
              style={{
                display: "flex",
                gap: "20px",
                marginBottom: "24px",
                alignItems: "flex-start",
              }}
            >
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                <label
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "#1E293B",
                  }}
                >
                  Start date
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94A3B8",
                      fontSize: "14px",
                    }}
                  >
                    📅
                  </span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={inputStyle(errors.startDate)}
                  />
                </div>
                {errors.startDate && (
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      color: "#EF4444",
                    }}
                  >
                    {errors.startDate}
                  </div>
                )}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <label
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#1E293B",
                    }}
                  >
                    End date
                  </label>
                  {duration && (
                    <span
                      style={{
                        backgroundColor: "#DBEAFE",
                        color: "#1D4ED8",
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        fontSize: "12px",
                        padding: "3px 10px",
                        borderRadius: "20px",
                      }}
                    >
                      {duration} days
                    </span>
                  )}
                </div>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94A3B8",
                      fontSize: "14px",
                    }}
                  >
                    📅
                  </span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={inputStyle(errors.endDate)}
                  />
                </div>
                {errors.endDate && (
                  <div
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      color: "#EF4444",
                    }}
                  >
                    {errors.endDate}
                  </div>
                )}
              </div>
            </div>

            {/* Row 3 - Travellers */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#1E293B",
                }}
              >
                Number of travellers
              </label>
              <div style={{ display: "flex", gap: "16px", marginTop: "10px" }}>
                {TRAVELLER_OPTIONS.map((opt) => {
                  const selected = travellers === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setTravellers(opt.id)}
                      style={{
                        flex: 1,
                        border: selected ? "2px solid #2563EB" : "1px solid #E2E8F0",
                        backgroundColor: selected ? "#EFF6FF" : "#FFFFFF",
                        borderRadius: "12px",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontSize: "28px" }}>{opt.icon}</div>
                      <div
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 500,
                          fontSize: "14px",
                          color: selected ? "#2563EB" : "#1E293B",
                        }}
                      >
                        {opt.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                          color: selected ? "#2563EB" : "#94A3B8",
                        }}
                      >
                        {opt.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.travellers && (
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    color: "#EF4444",
                    marginTop: "6px",
                  }}
                >
                  {errors.travellers}
                </div>
              )}
            </div>

            {/* Row 4 - Budget */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#1E293B",
                }}
              >
                Total budget
              </label>
              <div
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: "24px",
                  color: "#2563EB",
                  textAlign: "center",
                  margin: "12px 0",
                }}
              >
                ₹{budget.toLocaleString("en-IN")}
              </div>
              <input
                type="range"
                min={2000}
                max={100000}
                step={1000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#2563EB" }}
              />
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop: "12px",
                  flexWrap: "wrap",
                }}
              >
                {BUDGET_CHIPS.map((chip) => {
                  const active = budget === chip.value;
                  return (
                    <div
                      key={chip.label}
                      onClick={() => setBudget(chip.value)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "20px",
                        border: active ? "none" : "1px solid #E2E8F0",
                        backgroundColor: active ? "#2563EB" : "#FFFFFF",
                        color: active ? "#FFFFFF" : "#64748B",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "13px",
                        cursor: "pointer",
                      }}
                    >
                      {chip.label}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row 5 - Travel style */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#1E293B",
                }}
              >
                Travel style
              </label>
              <div style={{ display: "flex", gap: "16px", marginTop: "10px" }}>
                {STYLE_OPTIONS.map((opt) => {
                  const selected = travelStyle === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setTravelStyle(opt.id)}
                      style={{
                        flex: 1,
                        border: selected ? "2px solid #2563EB" : "1px solid #E2E8F0",
                        backgroundColor: selected ? "#EFF6FF" : "#FFFFFF",
                        borderRadius: "12px",
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "8px",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "32px" }}>{opt.icon}</div>
                      <div
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 500,
                          fontSize: "15px",
                          color: selected ? "#2563EB" : "#1E293B",
                        }}
                      >
                        {opt.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "13px",
                          color: selected ? "#2563EB" : "#64748B",
                        }}
                      >
                        {opt.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Row 6 - Interests */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#1E293B",
                }}
              >
                What interests you?
              </label>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  color: "#64748B",
                  marginBottom: "10px",
                }}
              >
                Select all that apply
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {INTERESTS.map((item) => {
                  const selected = interests.includes(item);
                  return (
                    <div
                      key={item}
                      onClick={() => toggleInterest(item)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "20px",
                        border: selected ? "1px solid #2563EB" : "1px solid #E2E8F0",
                        backgroundColor: selected ? "#EFF6FF" : "#FFFFFF",
                        color: selected ? "#2563EB" : "#64748B",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {selected && <span>✓</span>}
                      {item}
                    </div>
                  );
                })}
              </div>
              {errors.interests && (
                <div
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    color: "#EF4444",
                    marginTop: "8px",
                  }}
                >
                  {errors.interests}
                </div>
              )}
            </div>

            {/* Row 7 - Special requirements */}
            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#1E293B",
                }}
              >
                Any special requirements?
              </label>
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  color: "#64748B",
                  marginBottom: "8px",
                }}
              >
                Optional
              </div>
              <textarea
                value={notes}
                onChange={(e) => {
                  if (e.target.value.length <= 300) setNotes(e.target.value);
                }}
                placeholder="E.g. wheelchair accessible, vegetarian food only, travelling with elderly..."
                style={{
                  width: "100%",
                  height: "100px",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  padding: "12px",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  resize: "none",
                  outline: "none",
                }}
              />
              <div
                style={{
                  textAlign: "right",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12px",
                  color: "#94A3B8",
                }}
              >
                {notes.length}/300
              </div>
            </div>

            {/* Row 8 - Accommodation */}
            <div style={{ marginBottom: "32px" }}>
              <label
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500,
                  fontSize: "14px",
                  color: "#1E293B",
                }}
              >
                Accommodation preference
              </label>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "10px",
                  flexWrap: "wrap",
                }}
              >
                {ACCOMMODATION_OPTIONS.map((opt) => {
                  const selected = accommodation === opt;
                  return (
                    <div
                      key={opt}
                      onClick={() => setAccommodation(opt)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "20px",
                        border: selected ? "1px solid #2563EB" : "1px solid #E2E8F0",
                        backgroundColor: selected ? "#EFF6FF" : "#FFFFFF",
                        color: selected ? "#2563EB" : "#64748B",
                        fontFamily: "Inter, sans-serif",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Generate Button */}
            <div
              onClick={handleGenerate}
              style={{
                width: "100%",
                height: "56px",
                backgroundColor: "#2563EB",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <span style={{ color: "#FFFFFF", fontSize: "18px" }}>✨</span>
              <span
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  fontSize: "18px",
                  color: "#FFFFFF",
                }}
              >
                Generate My Itinerary
              </span>
              <span style={{ color: "#FFFFFF", fontSize: "18px" }}>→</span>
            </div>
            <div
              style={{
                textAlign: "center",
                fontFamily: "Inter, sans-serif",
                fontSize: "12px",
                color: "#94A3B8",
                marginTop: "12px",
              }}
            >
              Powered by Groq AI · Usually takes 10–15 seconds
            </div>
          </>
        )}
      </div>

      {/* Skeleton preview cards while loading */}
      {loading && (
        <div
          style={{
            maxWidth: "800px",
            margin: "24px auto 60px auto",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "12px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "20px",
                  backgroundColor: "#F1F5F9",
                  borderRadius: "4px",
                }}
              />
              <div
                style={{
                  width: "80%",
                  height: "16px",
                  backgroundColor: "#F1F5F9",
                  borderRadius: "4px",
                }}
              />
              <div
                style={{
                  width: "60%",
                  height: "16px",
                  backgroundColor: "#F1F5F9",
                  borderRadius: "4px",
                }}
              />
              <div
                style={{
                  width: "40%",
                  height: "16px",
                  backgroundColor: "#F1F5F9",
                  borderRadius: "4px",
                }}
              />
            </div>
          ))}
        </div>
      )}

      {!loading && <div style={{ height: "60px" }} />}
    </div>
  );
}
