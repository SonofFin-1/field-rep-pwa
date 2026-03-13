import type { Lead } from './types'

// Name data for generating unique combinations
const firstNames = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Lisa', 'Daniel', 'Nancy',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
  'Kenneth', 'Dorothy', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
  'Timothy', 'Deborah', 'Ronald', 'Stephanie', 'Edward', 'Rebecca', 'Jason', 'Sharon',
  'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen', 'Gary', 'Amy',
  'Nicholas', 'Angela', 'Eric', 'Shirley', 'Jonathan', 'Anna', 'Stephen', 'Brenda',
  'Larry', 'Pamela', 'Justin', 'Emma', 'Scott', 'Nicole', 'Brandon', 'Helen',
  'Benjamin', 'Samantha', 'Samuel', 'Katherine', 'Raymond', 'Christine', 'Gregory', 'Debra',
  'Frank', 'Rachel', 'Alexander', 'Carolyn', 'Patrick', 'Janet', 'Jack', 'Catherine',
  'Dennis', 'Maria', 'Jerry', 'Heather', 'Tyler', 'Diane', 'Aaron', 'Ruth',
  'Jose', 'Julie', 'Adam', 'Olivia', 'Nathan', 'Joyce', 'Henry', 'Virginia',
  'Douglas', 'Victoria', 'Zachary', 'Kelly', 'Peter', 'Lauren', 'Kyle', 'Christina',
  'Noah', 'Joan', 'Ethan', 'Evelyn', 'Jeremy', 'Judith', 'Walter', 'Megan',
  'Christian', 'Andrea', 'Keith', 'Cheryl', 'Roger', 'Hannah', 'Terry', 'Jacqueline',
  'Austin', 'Martha', 'Sean', 'Gloria', 'Gerald', 'Teresa', 'Carl', 'Ann',
  'Dylan', 'Sara', 'Harold', 'Madison', 'Jordan', 'Frances', 'Jesse', 'Kathryn',
  'Bryan', 'Janice', 'Lawrence', 'Jean', 'Arthur', 'Abigail', 'Gabriel', 'Alice',
  'Bruce', 'Judy', 'Logan', 'Sophia', 'Albert', 'Grace', 'Willie', 'Denise',
  'Alan', 'Amber', 'Vincent', 'Doris', 'Eugene', 'Marilyn', 'Russell', 'Danielle',
  'Elijah', 'Beverly', 'Randy', 'Isabella', 'Philip', 'Theresa', 'Harry', 'Diana',
  'Wayne', 'Natalie', 'Howard', 'Brittany', 'Roy', 'Charlotte', 'Louis', 'Marie',
  'Billy', 'Kayla', 'Joe', 'Alexis', 'Mason', 'Lori'
]

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
  'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker',
  'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy',
  'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey',
  'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza',
  'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers',
  'Long', 'Ross', 'Foster', 'Jimenez', 'Powell', 'Jenkins', 'Perry', 'Russell',
  'Sullivan', 'Bell', 'Coleman', 'Butler', 'Henderson', 'Barnes', 'Gonzales', 'Fisher',
  'Vasquez', 'Simmons', 'Stokes', 'Simpson', 'Patterson', 'Jordan', 'Reynolds', 'Hamilton',
  'Graham', 'Wallace', 'Woods', 'Cole', 'West', 'Owens', 'McDonald', 'Gibson',
  'Ellis', 'Harrison', 'Murray', 'Freeman', 'Wells', 'Webb', 'Simpson', 'Stevens',
  'Tucker', 'Porter', 'Hunter', 'Hicks', 'Crawford', 'Henry', 'Boyd', 'Mason',
  'Moreno', 'Kennedy', 'Warren', 'Dixon', 'Ramos', 'Reyes', 'Burns', 'Gordon',
  'Shaw', 'Holmes', 'Rice', 'Robertson', 'Hunt', 'Black', 'Daniels', 'Palmer',
  'Mills', 'Nichols', 'Grant', 'Knight', 'Ferguson', 'Rose', 'Stone', 'Hawkins',
  'Dunn', 'Perkins', 'Hudson', 'Spencer', 'Gardner', 'Stephens', 'Payne', 'Pierce',
  'Berry', 'Matthews', 'Arnold', 'Wagner', 'Willis', 'Ray', 'Watkins', 'Olson',
  'Carroll', 'Duncan', 'Snyder', 'Hart', 'Cunningham', 'Bradley', 'Lane', 'Andrews',
  'Ruiz', 'Harper', 'Fox', 'Riley', 'Armstrong', 'Carpenter', 'Weaver', 'Greene'
]

const streetNames = [
  'Main', 'Oak', 'Maple', 'Cedar', 'Pine', 'Elm', 'Washington', 'Lake',
  'Hill', 'Walnut', 'Spring', 'North', 'South', 'Park', 'River', 'Church',
  'High', 'Union', 'Market', 'Water', 'Forest', 'Sunset', 'Ridge', 'Valley',
  'Meadow', 'Garden', 'Grove', 'Highland', 'Lincoln', 'Jefferson', 'Franklin', 'Madison',
  'Adams', 'Jackson', 'Monroe', 'Wilson', 'Broadway', 'Center', 'School', 'Mill',
  'College', 'Woodland', 'Cherry', 'Willow', 'Hickory', 'Birch', 'Spruce', 'Ash',
  'Poplar', 'Chestnut', 'Laurel', 'Holly', 'Rose', 'Ivy', 'Vine', 'Fern'
]

const streetTypes = ['St', 'Ave', 'Blvd', 'Dr', 'Ln', 'Way', 'Ct', 'Rd', 'Pl', 'Circle']

const cities = [
  { name: 'Edina', state: 'MN', zip: '55410', lat: 44.8897, lng: -93.3499 },
  { name: 'Edina', state: 'MN', zip: '55424', lat: 44.9097, lng: -93.3299 },
  { name: 'Edina', state: 'MN', zip: '55435', lat: 44.8697, lng: -93.3599 },
  { name: 'Edina', state: 'MN', zip: '55436', lat: 44.8797, lng: -93.3699 },
  { name: 'Edina', state: 'MN', zip: '55439', lat: 44.8597, lng: -93.3799 },
  { name: 'Minneapolis', state: 'MN', zip: '55401', lat: 44.9778, lng: -93.2650 },
  { name: 'Minneapolis', state: 'MN', zip: '55403', lat: 44.9678, lng: -93.2850 },
  { name: 'Minneapolis', state: 'MN', zip: '55405', lat: 44.9578, lng: -93.3050 },
  { name: 'Minneapolis', state: 'MN', zip: '55408', lat: 44.9478, lng: -93.2950 },
  { name: 'Minneapolis', state: 'MN', zip: '55409', lat: 44.9278, lng: -93.2850 },
  { name: 'Minneapolis', state: 'MN', zip: '55410', lat: 44.9178, lng: -93.3150 },
  { name: 'Minneapolis', state: 'MN', zip: '55411', lat: 44.9978, lng: -93.2950 },
  { name: 'Minneapolis', state: 'MN', zip: '55412', lat: 45.0178, lng: -93.3050 },
  { name: 'Richfield', state: 'MN', zip: '55423', lat: 44.8677, lng: -93.2802 },
  { name: 'Bloomington', state: 'MN', zip: '55420', lat: 44.8408, lng: -93.2983 },
  { name: 'Bloomington', state: 'MN', zip: '55425', lat: 44.8308, lng: -93.3083 },
  { name: 'Bloomington', state: 'MN', zip: '55431', lat: 44.8208, lng: -93.3283 },
  { name: 'St. Louis Park', state: 'MN', zip: '55416', lat: 44.9297, lng: -93.3699 },
  { name: 'St. Louis Park', state: 'MN', zip: '55426', lat: 44.9397, lng: -93.3799 },
  { name: 'Hopkins', state: 'MN', zip: '55305', lat: 44.9197, lng: -93.3999 },
  { name: 'Hopkins', state: 'MN', zip: '55343', lat: 44.9097, lng: -93.4099 },
  { name: 'Golden Valley', state: 'MN', zip: '55422', lat: 44.9897, lng: -93.3599 },
  { name: 'Golden Valley', state: 'MN', zip: '55427', lat: 44.9797, lng: -93.3799 },
  { name: 'Plymouth', state: 'MN', zip: '55441', lat: 45.0097, lng: -93.4499 },
  { name: 'Plymouth', state: 'MN', zip: '55442', lat: 45.0197, lng: -93.4599 },
]

const summaries = [
  'High-value prospect who recently moved to the area. Interested in smart home integration.',
  'Existing customer looking to expand coverage. Has been satisfied with current system.',
  'Rental property owner seeking security for investment property.',
  'New homeowner with young children. Primary concern is fire and CO monitoring.',
  'Retired professional interested in comprehensive package with video verification.',
  'Long-time customer upgrading from legacy system. Great opportunity for refresh.',
  'Small business owner looking for both home and office security.',
  'Referral from satisfied customer. New construction home with pre-wiring available.',
  'Empty nester downsizing. Wants simple, easy-to-use system.',
  'Tech-savvy customer interested in DIY options and smart home integration.',
  'Previous customer returning after relocation. Account in good standing.',
  'Insurance referral program lead. Needs certificate for policy discount.',
  'Recently experienced break-in attempt. Urgent need for security system.',
  'Competitor customer unhappy with service. Comparing options.',
  'New build in progress. Ideal candidate for premium smart home package.',
  'Home office professional wanting comprehensive monitoring solution.',
  'Family with elderly parents. Interested in medical alert integration.',
  'Vacation home owner needing remote monitoring capabilities.',
  'Real estate investor with multiple properties to secure.',
  'Young professional first-time homeowner. Budget conscious but values quality.',
]

// Seeded random number generator for consistent results
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
}

function generateLeads(count: number): Lead[] {
  const random = seededRandom(42) // Fixed seed for reproducibility
  const generatedLeads: Lead[] = []
  const usedNames = new Set<string>()

  for (let i = 0; i < count; i++) {
    // Generate unique name
    let firstName: string
    let lastName: string
    let fullName: string

    do {
      firstName = firstNames[Math.floor(random() * firstNames.length)]
      lastName = lastNames[Math.floor(random() * lastNames.length)]
      fullName = `${firstName} ${lastName}`
    } while (usedNames.has(fullName))

    usedNames.add(fullName)

    // Generate address
    const streetNum = Math.floor(random() * 9000) + 1000
    const streetName = streetNames[Math.floor(random() * streetNames.length)]
    const streetType = streetTypes[Math.floor(random() * streetTypes.length)]
    const address = `${streetNum} ${streetName} ${streetType}`

    // Select city
    const cityData = cities[Math.floor(random() * cities.length)]

    // Generate coordinates with some variance
    const latVariance = (random() - 0.5) * 0.05
    const lngVariance = (random() - 0.5) * 0.05
    const lat = cityData.lat + latVariance
    const lng = cityData.lng + lngVariance

    // Generate score (weighted towards higher scores)
    const scoreRoll = random()
    let score: number
    if (scoreRoll < 0.3) {
      score = Math.floor(random() * 30) + 50 // 50-79 (30%)
    } else if (scoreRoll < 0.7) {
      score = Math.floor(random() * 15) + 70 // 70-84 (40%)
    } else {
      score = Math.floor(random() * 15) + 85 // 85-99 (30%)
    }

    // Generate value
    const value = Math.floor(random() * 8000) + 1500 // $1,500 - $9,500

    // Generate status
    const status: 'New' | 'Returning' = random() < 0.65 ? 'New' : 'Returning'

    // Generate email
    const emailVariant = Math.floor(random() * 3)
    let email: string
    if (emailVariant === 0) {
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`
    } else if (emailVariant === 1) {
      email = `${firstName.toLowerCase().charAt(0)}${lastName.toLowerCase()}@email.com`
    } else {
      email = `${firstName.toLowerCase()}${Math.floor(random() * 99)}@email.com`
    }

    // Generate phone
    const areaCode = ['612', '651', '763', '952'][Math.floor(random() * 4)]
    const phone = `${areaCode}-${Math.floor(random() * 900) + 100}-${Math.floor(random() * 9000) + 1000}`

    // Select summary
    const summary = summaries[Math.floor(random() * summaries.length)]

    // Generate purchase history for returning customers
    const purchaseHistory = status === 'Returning' && random() > 0.3
      ? [
          {
            date: `${Math.floor(random() * 12) + 1}/15/${2024 - Math.floor(random() * 3)}`,
            item: ['Basic Security Package', 'Premium Home Package', 'Smart Doorbell', 'Camera Add-on', 'Sensor Kit'][Math.floor(random() * 5)],
            amount: Math.floor(random() * 2000) + 500,
          }
        ]
      : undefined

    // Generate visit history
    const visitHistory = random() > 0.4
      ? [
          {
            date: `${Math.floor(random() * 3) + 1}/${Math.floor(random() * 28) + 1}/26`,
            notes: [
              'Initial consultation completed. Customer interested in full home security.',
              'Follow-up call scheduled. Customer comparing options.',
              'Site survey completed. Ready for installation quote.',
              'Customer requested additional information about smart features.',
              'Discussed pricing options. Customer needs time to decide.',
            ][Math.floor(random() * 5)],
            followUp: random() > 0.5 ? 'Follow-up scheduled' : undefined,
          }
        ]
      : undefined

    generatedLeads.push({
      id: `lead-${i + 1}`,
      name: fullName,
      email,
      phone,
      address,
      city: cityData.name,
      state: cityData.state,
      zip: cityData.zip,
      score,
      value,
      status,
      lat,
      lng,
      summary,
      purchaseHistory,
      visitHistory,
    })
  }

  return generatedLeads
}

// Generate 1000 leads
export const leads: Lead[] = generateLeads(1000)

// Ensure appointment leads (lead-1 and lead-5) have high scores (80+)
const lead1 = leads.find(l => l.id === 'lead-1')
const lead5 = leads.find(l => l.id === 'lead-5')
if (lead1) lead1.score = 92
if (lead5) lead5.score = 85

// Map leads is now just a reference to the main leads array
export const mapLeads: Lead[] = leads

// Get a lead by ID
export function getLeadById(id: string): Lead | undefined {
  return leads.find(lead => lead.id === id)
}
