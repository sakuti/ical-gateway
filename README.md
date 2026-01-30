# ical-gateway

ical-gateway is a work-in-progress project that allows users to create filtered iCalendar subscriptions. All of calendar subscriptions (like hobbies, school, or public schedules) are read-only and cannot be modified. This project lets users remove unwanted events or individual occurrences from such subscriptions while still keeping automatic updates from the original source.

## Key goals:
- Import a read-only .ics subscription link
- Apply user-defined modifications 
- Generate a new .ics subscription calendar that updates automatically
- Keep the original calendar intact
- Provide a simple web interface to manage subscriptions and rules

## Project Architecture
```
Frontend (work in progress)
    - Adding new subscriptions
    - Calendar to manage rulesets
    - Export link to modified calendar 

Backend (MVP done)
    - Stores subscriptions and rules in SQLite (might switch to MySQL?)
    - Applies rules, removes single events or adds EXDATE for recurring events
    - Fetches original ICS calendars
    - Emits modified ICS files

    - Serves:
        • POST /subscribe
        • GET /calendar/:id.ics
        • GET /rules?subscriptionId=...
        • DELETE /rules
```

## Components

__Frontend__
- React (TypeScript) + Vite
- Tailwind CSS for layout

__Backend__
- Express + TypeScript
- SQLite database for subscriptions and rules
- Fetches remote calendars and applies rules
- Generates somewhat-RFC-compliant ICS files dynamically
- Caching mechanism for fetched subscriptions to improve performance
