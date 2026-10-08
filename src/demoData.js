export const demoState = {
  properties: [
    {
      id: "p1",
      name: "Green Home",
      location: "Bengaluru",
      type: "2 BHK Apartment",
      rent: 18000,
      deposit: 50000,
      eco: 5,
      features: ["Solar Power", "Rainwater Harvesting", "LED Lighting"],
      description: "A comfortable home designed with simple sustainable features.",
      address: "Yelahanka New Town, Bengaluru",
      bedrooms: 2,
      status: "Occupied"
    },
    {
      id: "p2",
      name: "Solar Nest",
      location: "Mysuru",
      type: "1 BHK Apartment",
      rent: 14000,
      deposit: 40000,
      eco: 4,
      features: ["Solar Water Heater", "Natural Ventilation", "LED Lighting"],
      description: "A compact and energy-conscious apartment for comfortable living.",
      address: "VV Mohalla, Mysuru",
      bedrooms: 1,
      status: "Available"
    },
    {
      id: "p3",
      name: "Eco Villa",
      location: "Hyderabad",
      type: "3 BHK Villa",
      rent: 26000,
      deposit: 70000,
      eco: 5,
      features: ["Solar Panels", "Garden", "Water Recycling"],
      description: "A spacious eco-friendly villa with greenery and water-saving systems.",
      address: "Kondapur, Hyderabad",
      bedrooms: 3,
      status: "Occupied"
    }
  ],
  tenants: [
    { id: "t1", full_name: "Arjun Kumar", email: "arjun@example.com", phone: "+91 98765 43210" },
    { id: "t2", full_name: "Priya Sharma", email: "priya@example.com", phone: "+91 99887 66554" }
  ],
  agreements: [
    {
      id: "a1",
      property_id: "p1",
      tenant_id: "t1",
      owner_name: "Raj Shekar",
      start_date: "2026-01-01",
      end_date: "2026-12-31",
      monthly_rent: 18000,
      security_deposit: 50000,
      notice_period_days: 30,
      maintenance: 1200,
      status: "Active"
    },
    {
      id: "a2",
      property_id: "p3",
      tenant_id: "t2",
      owner_name: "Raj Shekar",
      start_date: "2026-03-01",
      end_date: "2026-11-08",
      monthly_rent: 26000,
      security_deposit: 70000,
      notice_period_days: 30,
      maintenance: 1500,
      status: "Expiring Soon"
    }
  ],
  payments: [
    { id: "r1", agreement_id: "a1", tenant_id: "t1", month: "October 2026", amount: 18000, payment_date: "2026-10-02", status: "Paid" },
    { id: "r2", agreement_id: "a1", tenant_id: "t1", month: "November 2026", amount: 18000, payment_date: null, status: "Pending" },
    { id: "r3", agreement_id: "a2", tenant_id: "t2", month: "October 2026", amount: 26000, payment_date: "2026-10-04", status: "Paid" }
  ],
  documents: []
};
