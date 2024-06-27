import express, { Request, Response } from "express";
import bodyParser from 'body-parser';
// import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3000;
app.use(express.json());
app.use('/', limitRequests);

interface User {
    id: number;
    userName: string;
    password: string;
    email: string;
    fullName: string;
    providerId?: number;
    meterId?: number;
}

interface Provider {
    id: number;
    name: string;
    charge: number;
}

interface readings {
    units: number,
    time: Date
}

interface Meter {
    id: number;
    name: string;
    reading: readings[];
}

const findById = (array : any, id : any) => array.find((item:any) => item.id === parseInt(id));

let users: User[] = [];

const providers: Provider[] = [
    { id: 1, name: "Electro", charge: 5 },
    { id: 2, name: "Magneto", charge: 10 }
];

let meters: Meter[] = [];

//task-6
interface UserDTO {
    id: number;
    userName: string;
    email: string;
    fullName: string;
}

const mapUserToDTO = (user: User): UserDTO => {
    const { id, userName, email, fullName } = user;
    return { id, userName, email, fullName };
};

const getUsersDTO = (users: User[]): UserDTO[] => {
    return users.map(user => mapUserToDTO(user));
};

const requestCount = new Map<string, { count: number, resetTime: number }>();

//task-5 and task -7
function limitRequests(req: Request, res: Response, next: Function) {
    const userId = req.headers['user-id'] as string;

    if (!requestCount.has(userId)) {
        requestCount.set(userId, { count: 0, resetTime: Date.now() + 60000 });
    }

    const { count, resetTime } = requestCount.get(userId)!;

    if (Date.now() > resetTime) {
        requestCount.set(userId, { count: 0, resetTime: Date.now() + 60000 });
    }

    requestCount.get(userId)!.count++;

    if (requestCount.get(userId)!.count > 100) {
        return res.status(429).send('Too many requests');
    }

    next();
}
//task-1
const authenticateAdmin = (req: Request, res: Response, next: Function) => {
    const adminId = parseInt(req.headers['admin-id'] as string);
    console.log(adminId);
    if (adminId && adminId === 100) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};

const authenticateUser = (req: Request, res: Response, next: Function) => {
    const userId = parseInt(req.headers['user-id'] as string);
    const requestedUserId = parseInt(req.params.id);
    if (userId && userId === requestedUserId) {
        next();
    } else {

        res.status(401).send('Unauthorized');
    }
};

// Return all users
// app.get('/users', (req, res) => {
//     res.json(users);
// });

// Return a user with parameter id if not exists return message saying `user not found`
// app.get('/users/:id', (req: Request, res: Response) => {
//     const user = users.find(u => u.id === parseInt(req.params.id));
//     if (user) {
//         res.json(user);
//     } else {
//         res.send('User not found');
//     }
// });

// Create a user with attributes username, password, email and fullname
app.post('/users', (req, res) => {
    const { userName, password, email, fullName } = req.body;
    const newUser: User = {
        id: users.length + 1,
        userName,
        password,
        email,
        fullName
    };
    users.push(newUser);
    res.json(newUser);
});

// update user information for given id
app.put('/users/:id', authenticateUser, (req: Request, res: Response) => {
    let user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        user = { ...user, ...req.body }
        res.json(user);
    } else {
        res.send('User not found');
    }
});

// delete user for given id
app.delete('/users/:id',  authenticateUser,(req: Request, res: Response) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index !== -1) {
        users.splice(index, 1);
        res.send();
    } else {
        res.send('User not found');
    }
});

// Get all providers
app.get('/providers', (req: Request, res: Response) => {
    res.json(providers);
});

// Create a provider
app.post('/providers', (req: Request, res: Response) => {
    const { name, charge } = req.body;
    const newProvider: Provider = {
        id: providers.length + 1,
        name,
        charge
    };
    providers.push(newProvider);
    res.json(newProvider);
});

// Update a provider by id
app.put('/providers/:id', (req: Request, res: Response) => {
    const provider = providers.find(p => p.id === parseInt(req.params.id));
    if (provider) {
        const { name, charge } = req.body;
        if (name) provider.name = name;
        if (charge) provider.charge = charge;
        res.json(provider);
    } else {
        res.send('Provider not found');
    }
});

// Delete a provider by id
app.delete('/providers/:id', (req: Request, res: Response) => {
    const index = providers.findIndex(p => p.id === parseInt(req.params.id));
    if (index !== -1) {
        providers.splice(index, 1);
        res.send();
    } else {
        res.send('Provider not found');
    }
});

// User Subscription to Providers
app.post('/users/:id/subscription', (req: Request, res: Response) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    const providerId = parseInt(req.body.providerId);
    if (user && providers.find(p => p.id === providerId)) {
        user.providerId = providerId;
        res.json(user);
    } else {
        res.send('User or Provider not found');
    }
});

// Meter APIs

// get all meters
app.get("/meters", (req: Request, res: Response) => {
    res.json(meters);
})

// Create a meter
app.post('/meters', (req: Request, res: Response) => {
    const { name } = req.body;
    const newMeter: Meter = {
        id: meters.length + 1,
        name,
        reading: []
    };
    meters.push(newMeter);
    res.json(newMeter);
});

// Store meter reading
app.post("/meters/:id/reading", (req: Request
    , res: Response) => {
    const meter = meters.find((m) => m.id === parseInt(req.params.id));
    if (meter) {
        const { units, time } = req.body;
        const reading = { units, time };
        meter.reading.push(reading);
        res.json(meter);
    } else {
        res.send("Meter not found")
    }
});

// adding a meter
app.post('/users/:id/meterSubscription', (req: Request, res: Response) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    const meterId = parseInt(req.body.meterId);
    if (user && meters.find(p => p.id === meterId)) {
        user.meterId = meterId;
        res.json(user);
    } else {
        res.send('User or Meter not found');
    }
});

// Get meter reading
app.get("/meters/:id/reading", (req: Request, res: Response) => {
    const meter = meters.find((m) => m.id === parseInt(req.params.id));
    if (meter) {
        res.json(meter.reading);
    } else {
        res.send("Meter not found");
    }
});

// Get all readings by user ID
app.get('/users/:id/readings', (req: Request, res: Response) => {
    const user = users.find(user => user.meterId == parseInt(req.params.id));
    if (user) {
        const meter = meters.find(meter => meter.id === user.meterId)
        if (meter) {
            res.json(meter.reading);
        }
    } else {
        res.send('User or Meter not found');
    }
});

// Calculate bill for user
app.get("/users/:id/bill", (req: Request, res: Response) => {
    const user = users.find((u) => u.id === parseInt(req.params.id));
    if (user) {
        const provider = providers.find(p => p.id === user.providerId);
        const userMeters = meters.find(m => m.id == user.meterId);
        if (userMeters) {
            const userReadings = userMeters.reading
            const totalUnits = userReadings.reduce((sum, m) => sum + m.units, 0);
            const bill = totalUnits * (provider ? provider.charge : 0);
            res.json({ user_id: user.id, amount: bill });
        }
    } else {
        res.send("User or Provider not found");
    }
});

//task-1 only with authentication headers
// app.get('/users', authenticateAdmin, (req: Request, res: Response) => {
//     res.json(users);
// });

// app.get('/users/:id', authenticateUser, (req: Request, res: Response) => {
//     const userId = parseInt(req.params.id);
//     const user = users.find(user => user.id === userId);
//     if (user) {
//         res.json(user);
//     } else {
//         res.status(404).json({ message: 'User not found!' });
//     }
// });

//task-1  authentication verification with dtos,pagination
app.get('/users', authenticateAdmin, (req, res) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || users.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = users.slice(startIndex, endIndex);
    res.send(getUsersDTO(paginatedUsers));
});

app.get('/users/:id', authenticateUser, (req, res) => {
    const id = req.params.id;
    const user = findById(users, id);
    if (user) {
        res.json(mapUserToDTO(user));
    } else {
        res.status(404).send("User not found");
    }
});

// task-2 Get readings for the past N days
function filterReadingsByDays(readings: readings[], days: number): readings[] {
    const now = new Date();
    const pastDate = new Date(now);
    pastDate.setDate(pastDate.getDate() - days);

    return readings.filter(reading => new Date(reading.time) >= pastDate);
}

app.get('/users/:id/readings/:days', authenticateUser, (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const days = parseInt(req.params.days);

    const user = users.find(u => u.id === userId);
    if (user) {
        const meter = meters.find(m => m.id === user.meterId);
        if (meter) {
            const filteredReadings = filterReadingsByDays(meter.reading, days);
            res.json(filteredReadings);
        } else {
            res.status(404).send('Meter not found');
        }
    } else {
        res.status(404).send('User not found');
    }
});

//task-3 bill updation
const calculateUnitsInCurrentBillingCycle = (readings: readings[]): number => {
    const currentDate = new Date();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    return readings
        .filter(reading => new Date(reading.time) >= firstDay && new Date(reading.time) <= lastDay)
        .reduce((total, reading) => total + reading.units, 0);
};

app.get('/users/:id/consumedBill', authenticateUser, (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (user) {
        const meter = meters.find(m => m.id === user.meterId);
        const provider = providers.find(p => p.id === user.providerId);

        if (meter && provider) {
            const unitsConsumed = calculateUnitsInCurrentBillingCycle(meter.reading);
            const billAmount = unitsConsumed * provider.charge;
            res.json({ unitsConsumed, billAmount });
        } else {
            res.status(404).send('Meter or Provider not found');
        }
    } else {
        res.status(404).send('User not found');
    }
});
 
//task-4 top 3 providers
const calculateTotalUnitsConsumed = (readings: readings[]): number => {
    return readings.reduce((total, reading) => total + reading.units, 0);
};

app.get('/users/:id/top-providers', authenticateUser, (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (user) {
        const meter = meters.find(m => m.id === user.meterId);

        if (meter) {
            const totalUnits = calculateTotalUnitsConsumed(meter.reading);

            const providerCosts = providers.map(provider => ({
                provider,
                cost: totalUnits * provider.charge
            }));

            providerCosts.sort((a, b) => a.cost - b.cost);

            const topProviders = providerCosts.slice(0, 3).map(pc => ({
                providerId: pc.provider.id,
                providerName: pc.provider.name,
                cost: pc.cost
            }));

            res.json(topProviders);
        } else {
            res.status(404).send('Meter not found');
        }
    } else {
        res.status(404).send('User not found');
    }
});
app.listen(port, () => {
    console.log(`server is running on port http://localhost:${port}`)
});
