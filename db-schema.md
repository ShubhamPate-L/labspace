# Database Schema: BMU LabSpace

**Database:** MongoDB (Atlas), accessed through **Mongoose**.
**Collections:** `users`, `labs`, `equipment`, `bookings`.

## Relationships

```
Lab (1) ──────< Equipment (many)
User (1) ─────< Booking (many)
Equipment (1) ─< Booking (many)
```

- An equipment item belongs to one lab. The lab's `wing` is the "category" shown in the catalog filter.
- A booking links one user to one equipment item for one date and one time slot.
- **Slot availability is not stored.** It is computed: a slot is "booked" if an active booking exists for that equipment, date, and slot.

## Shared constants

```js
const SLOTS = ['09:00-10:30', '10:30-12:00', '13:00-14:30', '14:30-16:00'];
const WINGS = ['SOET Wing', 'MakerSpace', 'Robotics', 'IoT Lab'];
```

---

## 1. `users`

| Field | Type | Rules |
|---|---|---|
| `_id` | ObjectId | auto |
| `name` | String | required, trimmed |
| `rollNumber` | String | required for students, unique (sparse) |
| `email` | String | required, unique, lowercase |
| `passwordHash` | String | required, bcrypt hash, **never returned in responses** |
| `role` | String | enum: `student`, `admin`; default `student` |
| `createdAt` | Date | default now |

Notes:
- Students log in with roll number **or** email.
- Admins are created by the seed script only. There is no public admin registration.

```js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  rollNumber: { type: String, unique: true, sparse: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  createdAt: { type: Date, default: Date.now }
});
```

## 2. `labs`

| Field | Type | Rules |
|---|---|---|
| `_id` | ObjectId | auto |
| `name` | String | required, unique (e.g. `Lab 102`) |
| `wing` | String | required, enum `WINGS` |

```js
const labSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  wing: { type: String, required: true, enum: WINGS }
});
```

## 3. `equipment`

| Field | Type | Rules |
|---|---|---|
| `_id` | ObjectId | auto |
| `name` | String | required (e.g. `Digital Oscilloscope 50MHz`) |
| `equipmentId` | String | required, unique (e.g. `EQ-OSC-102`) |
| `lab` | ObjectId, ref `Lab` | required |
| `status` | String | enum: `available`, `maintenance`; default `available` |
| `createdAt` | Date | default now |

```js
const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  equipmentId: { type: String, required: true, unique: true, uppercase: true, trim: true },
  lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
  status: { type: String, enum: ['available', 'maintenance'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
});
```

## 4. `bookings`

| Field | Type | Rules |
|---|---|---|
| `_id` | ObjectId | auto |
| `user` | ObjectId, ref `User` | required |
| `equipment` | ObjectId, ref `Equipment` | required |
| `date` | String `YYYY-MM-DD` | required, not in the past |
| `slot` | String | required, enum `SLOTS` |
| `status` | String | enum: `pending`, `approved`, `cancelled`; default `pending` |
| `isActive` | Boolean | `true` unless cancelled; used by the unique index |
| `createdAt` | Date | default now |

**Double-booking protection:** a unique compound index on `(equipment, date, slot)` that only applies to active bookings.

```js
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  slot: { type: String, required: true, enum: SLOTS },
  status: { type: String, enum: ['pending', 'approved', 'cancelled'], default: 'pending' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

bookingSchema.index(
  { equipment: 1, date: 1, slot: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);
```

When a booking is cancelled, set `status: 'cancelled'` **and** `isActive: false` so the slot is free again but the history stays.

Rules enforced by the server:
- Equipment with `status: 'maintenance'` cannot be booked.
- A student can only cancel their own bookings.
- Only admins can approve a booking or cancel any booking.

---

## Seed data

**Labs**

| name | wing |
|---|---|
| Lab 102 | SOET Wing |
| Lab 201 | SOET Wing |
| Lab 204 | MakerSpace |
| Lab 105 | Robotics |
| Lab 108 | IoT Lab |

**Equipment**

| name | equipmentId | lab | status |
|---|---|---|---|
| Digital Oscilloscope 50MHz | EQ-OSC-102 | Lab 102 | available |
| Ender 3 V2 3D Printer | EQ-3D-204 | Lab 204 | available |
| Arduino Mega Starter Kit | EQ-ARD-105 | Lab 105 | maintenance |
| Function Generator 10MHz | EQ-FGEN-102 | Lab 102 | available |
| Raspberry Pi 4 Model B | EQ-RPI-108 | Lab 108 | available |
| Digital Soldering Station | EQ-SLD-201 | Lab 201 | available |

**Users**

| name | rollNumber | email | role |
|---|---|---|---|
| Shubham Patel | 230766 | (student email) | student |
| Lab Admin | (none) | admin@bmu.edu.in | admin |

Use a known demo password for seed accounts and store it only as a bcrypt hash.
