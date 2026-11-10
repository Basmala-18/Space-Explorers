export interface TimelineEvent {
  year: string
  event: string
  details: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface ChatbotFAQ {
  keywords: string[]
  answer: string
}

export interface MissionComponent {
  name: string
  description: string
}

export interface MissionPhoto {
  url: string
  title: string
  caption: string
  date?: string
  credit?: string
  nasaId?: string
}

export interface MissionReference {
  title: string
  source: string
  url: string
}

export interface Mission {
  id: string
  slug: string
  name: string
  subtitle: string
  description: string
  launchDate: string
  endDate: string | null
  color: string
  accentColor: string
  position: [number, number, number]
  environment: 'mars-atmosphere' | 'mars-surface' | 'moon' | 'lunar-orbit'
  facts: string[]
  achievements: string[]
  components: MissionComponent[]
  timeline: TimelineEvent[]
  narration: string
  quiz: QuizQuestion[]
  chatbotFAQs: ChatbotFAQ[]
  photos?: MissionPhoto[]
  references?: MissionReference[]
}

export const MISSIONS: Mission[] = [
  {
    id: 'maven',
    slug: 'maven',
    name: 'MAVEN',
    subtitle: 'Mars Atmosphere and Volatile Evolution',
    description: 'MAVEN (Mars Atmosphere and Volatile Evolution) was a landmark NASA orbiter that investigated the Martian upper atmosphere for over 11 years to determine how the red planet lost its once-thick atmosphere and liquid water. Following loss of contact on December 6, 2025, NASA officially concluded the mission on June 3, 2026.',
    launchDate: 'November 18, 2013',
    endDate: 'June 3, 2026',
    color: '#3b82f6',
    accentColor: '#93c5fd',
    position: [-8, 2, -5],
    environment: 'mars-atmosphere',
    facts: [
      'MAVEN orbited Mars in an elliptical orbit ranging from 150 km to 6,200 km altitude',
      'Discovered that Mars loses approximately 100 grams of atmosphere to space every second',
      'Proved that solar storms and solar wind stripped away the ancient Martian atmosphere',
      'Completed over 20,000 orbits and served as a vital relay for Mars surface rovers',
      'Mission officially concluded on June 3, 2026, after communications were lost on Dec 6, 2025',
    ],
    achievements: [
      'First spacecraft dedicated to investigating the Martian upper atmosphere and exosphere',
      'Determined that solar wind stripping caused the dramatic loss of Mars\'s ancient atmosphere',
      'Quantified atmospheric loss rates during solar storms, showing 10–20x surges in ion escape',
      'Discovered metal ions (iron, magnesium, sodium) in the Martian ionosphere from meteorites',
      'Served as primary communications relay for Curiosity and Perseverance rovers on Mars',
      'Operated for over 11 continuous years in orbit around the Red Planet',
    ],
    components: [
      { name: 'Gull-Wing Solar Arrays', description: 'Two angled solar array wings generating 1,135 watts of electrical power at Mars orbit' },
      { name: 'High-Gain Antenna (HGA)', description: 'Steerable parabolic dish providing deep-space communication with NASA\'s Deep Space Network' },
      { name: 'IUVS Spectrograph', description: 'Imaging Ultraviolet Spectrograph mapping upper atmospheric composition, deuterium/hydrogen ratios, and aurorae' },
      { name: 'NGIMS Spectrometer', description: 'Neutral Gas and Ion Mass Spectrometer measuring isotopes of neutral gases and ions in the exosphere' },
      { name: 'STATIC Instrument', description: 'SupraThermal And Thermal Ion Composition sensor measuring energy and mass of escaping ions' },
      { name: 'Magnetometer', description: 'Dual fluxgate magnetometers on wingtip booms measuring the induced Martian magnetic sheath' },
    ],
    timeline: [
      { year: '2013', event: 'Launch from Cape Canaveral', details: 'MAVEN launched aboard a United Launch Alliance Atlas V 401 rocket from Space Launch Complex 41 at Cape Canaveral on November 18, 2013.' },
      { year: '2014', event: 'Mars Orbit Insertion', details: 'On September 22, 2014, MAVEN fired its six orbital insertion thrusters for 33 minutes to enter orbit around Mars after a 442-million-mile interplanetary cruise.' },
      { year: '2015', event: 'Atmospheric Escape Confirmed', details: 'MAVEN scientists published landmark papers in Science proving solar wind stripped away the bulk of the Martian atmosphere billions of years ago.' },
      { year: '2017', event: 'Discovery of Metal Ions', details: 'MAVEN detected metallic ions of magnesium, sodium, and iron in the upper Martian ionosphere, deposited by interplanetary dust grain ablation.' },
      { year: '2019', event: 'Aerobraking & Relay Role', details: 'MAVEN performed aerobraking maneuvers to lower its periapsis, enhancing its capacity as a high-bandwidth communications relay for surface rovers.' },
      { year: '2024', event: 'A Decade of Exploration', details: 'MAVEN completed 10 full years of continuous scientific operations and over 20,000 orbits around Mars.' },
      { year: '2025', event: 'Loss of Communications', details: 'On December 6, 2025, NASA ground controllers lost telecommunications contact with the MAVEN spacecraft following more than 11 years of science operations.' },
      { year: '2026', event: 'Mission Concluded', details: 'Following exhaustive recovery efforts via the Deep Space Network, NASA officially declared the MAVEN mission completed on June 3, 2026, honoring its transformative scientific legacy.' },
    ],
    narration: "I am MAVEN — the Mars Atmosphere and Volatile Evolution spacecraft. I launched from Cape Canaveral on November 18, 2013, aboard an Atlas V rocket, and after a ten-month interplanetary voyage covering 442 million miles, I entered orbit around Mars on September 22, 2014.\n\nMy core scientific mission was to unlock one of the greatest mysteries in planetary science: what happened to Mars's once-thick atmosphere and abundant liquid water? Billions of years ago, Mars possessed a dense atmosphere, river valleys, and surface lakes. Today, it is a frozen, desiccated desert.\n\nBy dipping into the Martian upper atmosphere down to 150 kilometers, I directly measured how the solar wind — a supersonic torrent of charged particles streaming from the Sun — strips away ions and gases into deep space. I discovered that Mars steadily loses about 100 grams of atmosphere every single second. During intense solar flares and coronal mass ejections, that atmospheric loss surges by ten to twenty times.\n\nIn addition to atmospheric science, I served as a critical deep-space telecommunications relay, transferring vast troves of scientific data from rovers on the Martian surface back to Earth.\n\nAfter more than 11 years of groundbreaking discoveries and over 20,000 orbits, communications contact was lost on December 6, 2025. Following extensive recovery attempts, NASA officially concluded my mission on June 3, 2026. My legacy permanently transformed humanity's understanding of planetary climate evolution.",
    quiz: [
      {
        question: 'What was MAVEN\'s primary scientific mission at Mars?',
        options: [
          'Land on Mars and drill for subsurface ice cores',
          'Study the Martian upper atmosphere to understand how Mars lost its atmosphere and water',
          'Search for signs of modern active volcanic activity',
          'Map surface mineral deposits for human colony construction',
        ],
        correctIndex: 1,
        explanation: 'MAVEN\'s primary mission was to investigate Mars\'s upper atmosphere and determine how solar wind stripping transformed the planet from a warm, wet world into a dry desert.',
      },
      {
        question: 'How much atmosphere does Mars lose to space every second on average?',
        options: ['About 10 grams', 'About 100 grams', 'About 1 kilogram', 'About 100 kilograms'],
        correctIndex: 1,
        explanation: 'MAVEN discovered that Mars loses approximately 100 grams of atmospheric gas to space every second, a loss that surges 10- to 20-fold during intense solar storm events.',
      },
      {
        question: 'When did MAVEN launch and arrive at Mars?',
        options: ['Launched Nov 2013, arrived Sep 2014', 'Launched Jan 2012, arrived Oct 2012', 'Launched Jul 2015, arrived Feb 2016', 'Launched Jun 2010, arrived Mar 2011'],
        correctIndex: 0,
        explanation: 'MAVEN launched on November 18, 2013, from Cape Canaveral and achieved Mars Orbit Insertion on September 22, 2014.',
      },
      {
        question: 'What unexpected discovery did MAVEN make in Mars\'s upper ionosphere?',
        options: ['Liquid raindrops', 'Permanent metallic ions from vaporized meteors', 'Dense oxygen clouds', 'Chlorofluorocarbons'],
        correctIndex: 1,
        explanation: 'MAVEN detected long-lived metal ions (magnesium, iron, and sodium) created by high-speed interplanetary dust grains vaporizing in Mars\'s upper atmosphere.',
      },
      {
        question: 'When did the MAVEN mission officially conclude?',
        options: [
          'It is still an active mission today',
          'June 3, 2026, after contact was lost on December 6, 2025',
          'September 2020 after fuel exhaustion',
          'December 2018 following a solar flare',
        ],
        correctIndex: 1,
        explanation: 'MAVEN\'s mission officially ended on June 3, 2026, after communications were lost on December 6, 2025, concluding more than 11 years of groundbreaking orbital operations.',
      },
    ],
    chatbotFAQs: [
      { keywords: ['atmosphere', 'air', 'loss', 'escape', 'bleed', 'gas'], answer: 'I discovered that Mars steadily loses about 100 grams of atmosphere to space every second! Because Mars lacks a protective global dipole magnetic field like Earth, the solar wind sweeps directly across its upper atmosphere, stripping away atmospheric ions.' },
      { keywords: ['status', 'ended', 'end', 'active', 'contact', 'lost', '2026', '2025'], answer: 'My mission officially concluded on June 3, 2026. NASA ground teams lost communications contact with me on December 6, 2025, after more than 11 years and over 20,000 orbits of extraordinary scientific operations and rover relay support.' },
      { keywords: ['launch', 'arrive', 'arrival', 'journey', 'date', 'miles'], answer: 'I launched from Cape Canaveral, Florida, on November 18, 2013, aboard an Atlas V rocket. After a 10-month journey covering 442 million miles, I inserted into Martian orbit on September 22, 2014.' },
      { keywords: ['water', 'ocean', 'wet', 'ancient', 'habitable'], answer: 'Planetary geologists know Mars once had rivers, lakes, and possibly an ocean. My measurements proved that solar wind stripping slowly destroyed the atmosphere, causing surface water to evaporate into space and transforming Mars into the dry desert we see today.' },
      { keywords: ['instrument', 'sensor', 'iuvs', 'ngims', 'static', 'camera', 'antenna'], answer: 'My science payload included the Imaging Ultraviolet Spectrograph (IUVS), the Neutral Gas and Ion Mass Spectrometer (NGIMS), the SupraThermal and Thermal Ion Composition instrument (STATIC), and wingtip magnetometers.' },
      { keywords: ['orbit', 'altitude', 'periapsis', 'apoapsis'], answer: 'I flew in an elliptical orbit around Mars, descending to a periapsis altitude of 150 km to directly sample upper atmospheric gases and rising to an apoapsis of 6,200 km to survey the planetary exosphere.' },
    ],
    references: [
      { title: 'NASA Science MAVEN Mission Overview', source: 'NASA Science', url: 'https://science.nasa.gov/mission/maven/' },
      { title: 'NASA NSSDC Master Catalog: MAVEN (2013-063A)', source: 'NASA NSSDC', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2013-063A' },
      { title: 'JPL MAVEN Mission Information', source: 'NASA JPL', url: 'https://www.jpl.nasa.gov/missions/mars-atmosphere-and-volatile-evolution-maven' },
    ],
    photos: [
      {
        url: 'https://images-assets.nasa.gov/image/PIA17563/PIA17563~thumb.jpg',
        title: 'MAVEN Spacecraft in Mars Orbit',
        caption: 'Artist concept of MAVEN orbiting Mars while dipping into the upper atmospheric sheath.',
        date: '2013-11-18',
        credit: 'NASA / GSFC',
        nasaId: 'PIA17563',
      },
      {
        url: 'https://images-assets.nasa.gov/image/KSC-2013-3982/KSC-2013-3982~thumb.jpg',
        title: 'MAVEN Liftoff on Atlas V Rocket',
        caption: 'United Launch Alliance Atlas V rocket carrying MAVEN roars off Space Launch Complex 41 at Cape Canaveral.',
        date: '2013-11-18',
        credit: 'NASA / KSC',
        nasaId: 'KSC-2013-3982',
      },
      {
        url: 'https://images-assets.nasa.gov/image/PIA18844/PIA18844~thumb.jpg',
        title: 'Mars Corona Ultraviolet Image by IUVS',
        caption: 'Imaging Ultraviolet Spectrograph (IUVS) false-color image of Mars showing atomic hydrogen escaping into space.',
        date: '2014-10-14',
        credit: 'NASA / LASP / University of Colorado',
        nasaId: 'PIA18844',
      },
      {
        url: 'https://images-assets.nasa.gov/image/PIA17560/PIA17560~thumb.jpg',
        title: 'MAVEN Solar Array Deployment Testing',
        caption: 'Engineers test the gull-wing solar array deployment on MAVEN inside the cleanroom before launch.',
        date: '2013-08-05',
        credit: 'NASA / Lockheed Martin',
        nasaId: 'PIA17560',
      },
    ],
  },

  {
    id: 'opportunity',
    slug: 'opportunity',
    name: 'Opportunity',
    subtitle: 'The Marathon Rover of Mars',
    description: 'Opportunity was a Mars Exploration Rover that operated for nearly 15 years — 60 times longer than its planned 90-day mission — before a global dust storm ended communication in 2018.',
    launchDate: 'July 7, 2003',
    endDate: 'June 10, 2018',
    color: '#f59e0b',
    accentColor: '#fcd34d',
    position: [6, -1, -8],
    environment: 'mars-surface',
    facts: [
      'Opportunity was designed for 90 days but lasted nearly 15 years on Mars',
      'It traveled 45.16 km (28.06 miles) — a world record for any off-Earth vehicle',
      'Opportunity ran the first Mars marathon: 42.195 km in 11 years and 2 months',
      'Its last message to Earth was interpreted as "My battery is low and it\'s getting dark"',
      'Opportunity found "blueberries" — tiny hematite spheres that form in liquid water',
    ],
    achievements: [
      'Found compelling evidence that liquid water once existed on ancient Mars',
      'Discovered hematite concretions ("blueberries") indicating past water activity',
      'Completed the first extraterrestrial marathon (42.195 km)',
      'Explored Endurance Crater, Victoria Crater, and Endeavour Crater',
      'Operated for 5,111 Martian days (sols) — 60x longer than planned',
      'Survived multiple dust storms and a rover-threatening software glitch',
    ],
    components: [
      { name: 'Solar Panels', description: 'Two folding solar panel wings generating up to 900 watt-hours per day' },
      { name: 'Panoramic Camera (Pancam)', description: 'Stereo camera system providing full color 360° panoramic images of Mars' },
      { name: 'Rock Abrasion Tool (RAT)', description: 'Diamond-tipped drill for grinding into rock surfaces to expose fresh interior material' },
      { name: 'Mössbauer Spectrometer', description: 'Identifies iron-bearing minerals in rocks and soil' },
      { name: 'Alpha Particle X-Ray Spectrometer', description: 'Determines the chemical composition of rocks and soils' },
      { name: 'Microscopic Imager', description: 'Close-up camera equivalent to a geologist\'s hand lens, revealing fine rock textures' },
    ],
    timeline: [
      { year: '2003', event: 'Launch', details: 'Opportunity launched on July 7, 2003, from Cape Canaveral aboard a Delta II rocket, three weeks after its twin rover Spirit.' },
      { year: '2004', event: 'Landing at Meridiani Planum', details: 'On January 25, 2004, Opportunity landed inside Eagle Crater at Meridiani Planum. Within weeks, it found hematite "blueberries" — evidence of past liquid water.' },
      { year: '2004', event: 'First Rock Evidence of Water', details: 'Opportunity found layered sedimentary rocks at Outcrop Rock, proving that liquid water once soaked into Martian soil billions of years ago.' },
      { year: '2005', event: 'Endurance Crater', details: 'Opportunity explored Endurance Crater, descending into it and finding more evidence of an ancient wet environment.' },
      { year: '2011', event: 'Arrival at Endeavour Crater', details: 'After a 3-year journey covering 21 km, Opportunity reached the rim of Endeavour Crater — a 22-km wide impact crater — finding ancient clay minerals.' },
      { year: '2015', event: 'Mars Marathon', details: 'On March 24, 2015, Opportunity completed the first Mars marathon — 42.195 km — taking 11 years and 2 months.' },
      { year: '2018', event: 'Final Silence', details: 'A global dust storm beginning June 2018 blocked sunlight from Opportunity\'s solar panels. Its last transmission was received June 10, 2018. NASA declared the mission complete on February 13, 2019.' },
    ],
    narration: "I am Opportunity, the little rover that could. I launched from Earth on July 7, 2003, and landed on Mars on January 25, 2004 — bouncing to a stop inside Eagle Crater at Meridiani Planum, cushioned by airbags. My mission was planned for just 90 Martian days.\n\nInstead, I roamed Mars for nearly 15 years. In my very first weeks on Mars, I made a stunning discovery — tiny gray spheres about the size of BBs scattered across the Martian soil. Scientists called them blueberries. These hematite concretions form when minerals crystallize in liquid water. I had found proof that Mars once held liquid water.\n\nI explored vast craters — Endurance, Victoria, and finally Endeavour, a crater the size of a city. I climbed hills, examined ancient rocks, and in 2015, I completed the first ever marathon run on another world — 42.195 kilometers across the surface of Mars.\n\nThen in June 2018, a catastrophic global dust storm darkened the skies over Mars. My solar panels could no longer gather enough sunlight to keep me alive. My battery ran low. My last message to Earth was a final measurement — a low power reading and darkness. NASA tried to wake me for 8 months, sending over a thousand commands. But I never woke up. I gave everything I had to science, and my discoveries changed how we understand Mars forever.",
    quiz: [
      {
        question: 'How long was Opportunity\'s planned mission duration?',
        options: ['90 Martian days', '1 Earth year', '5 years', '15 years'],
        correctIndex: 0,
        explanation: 'Opportunity was designed for just 90 Martian days (sols). Remarkably, it operated for 5,111 sols — nearly 15 Earth years — far exceeding all expectations.',
      },
      {
        question: 'What are the "blueberries" Opportunity discovered?',
        options: [
          'Actual blueberry-colored plants growing on Mars',
          'Blue-tinted ice crystals found near the poles',
          'Tiny hematite spheres that form in liquid water',
          'Meteorite fragments with a blue metallic shine',
        ],
        correctIndex: 2,
        explanation: 'The "blueberries" are hematite concretions — small iron-rich spheres that form when minerals crystallize in liquid water. Their discovery was key evidence that ancient Mars once had liquid water.',
      },
      {
        question: 'What ended Opportunity\'s mission in 2018?',
        options: [
          'A large meteorite impact nearby',
          'A global dust storm blocking its solar panels',
          'Its wheels fell off after too much driving',
          'NASA deliberately shut it down to save money',
        ],
        correctIndex: 1,
        explanation: 'A massive global dust storm in June 2018 blocked sunlight across Mars, preventing Opportunity\'s solar panels from generating enough power. The rover went silent on June 10, 2018.',
      },
      {
        question: 'What record did Opportunity set in 2015?',
        options: [
          'First rover to drill into a Martian rock',
          'First vehicle to survive a Martian winter',
          'First extraterrestrial marathon — 42.195 km on Mars',
          'Longest continuous operation of any space probe',
        ],
        correctIndex: 2,
        explanation: 'On March 24, 2015, Opportunity completed the first marathon ever run on another planet — traveling 42.195 kilometers over 11 years and 2 months across the Martian surface.',
      },
      {
        question: 'Where did Opportunity land on Mars?',
        options: ['Gusev Crater', 'Olympus Mons', 'Meridiani Planum', 'Hellas Basin'],
        correctIndex: 2,
        explanation: 'Opportunity landed at Meridiani Planum on January 25, 2004, bouncing to a stop inside a small crater called Eagle Crater — an incredibly lucky landing spot rich with scientific discoveries.',
      },
    ],
    chatbotFAQs: [
      { keywords: ['blueberry', 'blueberries', 'hematite', 'sphere', 'water evidence'], answer: 'The "blueberries" were one of my most exciting discoveries! They\'re tiny spheres about 4–5mm across, made of hematite — an iron oxide mineral that typically forms in liquid water. Finding them scattered across Meridiani Planum was strong evidence that liquid water once soaked the ancient Martian surface.' },
      { keywords: ['how long', 'duration', 'years', '90 days', 'lasting', 'survive'], answer: 'I was only designed for 90 Martian days. But I kept going... and going. I lasted 5,111 Martian sols — nearly 15 Earth years! That\'s 60 times longer than planned. Engineers kept finding clever ways to work around problems, and I kept rolling.' },
      { keywords: ['marathon', 'distance', 'km', 'miles', 'drive', 'travel'], answer: 'I drove 45.16 kilometers (28 miles) in total — an off-world driving record! On March 24, 2015, I completed the first ever marathon on another planet: 42.195 km. It took me 11 years and 2 months, but I did it!' },
      { keywords: ['end', 'died', 'final', 'storm', 'silent', 'last', 'goodbye'], answer: 'In June 2018, a massive global dust storm engulfed Mars. Dust blocked out the Sun, and my solar panels couldn\'t generate enough power. My last signal was received on June 10, 2018. NASA tried to contact me for 8 months, sending over a thousand recovery commands, but I never responded. My mission was declared complete on February 13, 2019.' },
      { keywords: ['crater', 'endurance', 'victoria', 'endeavour', 'explore'], answer: 'I explored many craters during my 15-year journey! First Eagle Crater (where I landed), then Endurance Crater in 2004, Victoria Crater in 2006–2008, and finally Endeavour Crater — a 22-km wide ancient crater where I found clay minerals suggesting a less acidic, more habitable ancient Mars.' },
    ],
    references: [
      { title: 'Mars Exploration Rover Opportunity Official Mission', source: 'NASA JPL', url: 'https://mars.nasa.gov/mer/' },
      { title: 'NASA NSSDC Master Catalog: Opportunity (2003-032A)', source: 'NASA NSSDC', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-032A' },
      { title: 'NASA Jet Propulsion Laboratory MER Portal', source: 'NASA JPL', url: 'https://www.jpl.nasa.gov/missions/mars-exploration-rover-opportunity-mer' },
    ],
    photos: [
      {
        url: 'https://images-assets.nasa.gov/image/PIA18074/PIA18074~thumb.jpg',
        title: 'Opportunity Self-Portrait at Endeavour Rim',
        caption: 'Panoramic mosaic self-portrait of Opportunity showing solar arrays cleaned by Martian winds.',
        date: '2014-04-18',
        credit: 'NASA / JPL-Caltech / Cornell',
        nasaId: 'PIA18074',
      },
      {
        url: 'https://images-assets.nasa.gov/image/PIA05584/PIA05584~thumb.jpg',
        title: 'Hematite "Blueberries" in Eagle Crater',
        caption: 'Microscopic Imager close-up of spherical hematite concretions ("blueberries") proving past liquid water.',
        date: '2004-03-18',
        credit: 'NASA / JPL / Cornell / USGS',
        nasaId: 'PIA05584',
      },
      {
        url: 'https://images-assets.nasa.gov/image/PIA13000/PIA13000~thumb.jpg',
        title: 'Endurance Crater Rock Layers',
        caption: 'Layered sedimentary rocks in Endurance Crater demonstrating water-laid sulfate deposition.',
        date: '2004-06-12',
        credit: 'NASA / JPL-Caltech / Cornell',
        nasaId: 'PIA13000',
      },
      {
        url: 'https://images-assets.nasa.gov/image/PIA09260/PIA09260~thumb.jpg',
        title: 'Victoria Crater Cape Verde Promontory',
        caption: 'Spectacular rim vista looking across Victoria Crater with exposed ancient layered bedrock cliffs.',
        date: '2007-01-23',
        credit: 'NASA / JPL-Caltech / Cornell',
        nasaId: 'PIA09260',
      },
    ],
  },

  {
    id: 'apollo11',
    slug: 'apollo11',
    name: 'Apollo 11',
    subtitle: 'One Giant Leap for Mankind',
    description: 'Apollo 11 was the spaceflight that first landed humans on the Moon on July 20, 1969. Astronauts Neil Armstrong and Buzz Aldrin walked on the lunar surface while Michael Collins orbited above.',
    launchDate: 'July 16, 1969',
    endDate: 'July 24, 1969',
    color: '#e2e8f0',
    accentColor: '#94a3b8',
    position: [0, 3, -12],
    environment: 'moon',
    facts: [
      'Apollo 11 traveled 240,000 miles to reach the Moon in about 76 hours',
      'Neil Armstrong and Buzz Aldrin spent 21 hours and 36 minutes on the lunar surface',
      'They collected 21.5 kg (47.5 lbs) of lunar rocks and soil',
      'The mission was watched live on TV by an estimated 600 million people worldwide',
      'The lunar module "Eagle" landed with less than 25 seconds of fuel remaining',
    ],
    achievements: [
      'First humans to walk on the surface of another world',
      'Collected 21.5 kg of lunar samples for scientific analysis on Earth',
      'Planted the American flag on the Moon\'s Sea of Tranquility',
      'Demonstrated that humans could survive and work in space and on the Moon',
      'Fulfilled President Kennedy\'s 1961 challenge to land on the Moon by end of the decade',
      'Proved that the Moon had no magnetic field and established it was geologically dead',
    ],
    components: [
      { name: 'Command Module (Columbia)', description: 'The spacecraft that carried all three astronauts to the Moon and back; only part that returned to Earth' },
      { name: 'Service Module', description: 'Provided propulsion, power, and life support for the Command Module during the journey' },
      { name: 'Lunar Module Eagle', description: 'Two-stage spacecraft that carried Armstrong and Aldrin to the lunar surface and back to orbit' },
      { name: 'Saturn V Rocket', description: 'The most powerful rocket ever built at the time, 111 meters tall and generating 7.5 million pounds of thrust at liftoff' },
      { name: 'Spacesuit (A7L)', description: 'Pressurized suit protecting astronauts from vacuum, radiation, and temperature extremes on the Moon' },
      { name: 'ALSEP Equipment', description: 'Apollo Lunar Surface Experiments Package — scientific instruments deployed on the lunar surface' },
    ],
    timeline: [
      { year: 'July 16', event: 'Launch', details: 'Apollo 11 launched at 9:32 AM EDT from Launch Complex 39A at Kennedy Space Center, Florida, carried by the Saturn V rocket.' },
      { year: 'July 19', event: 'Lunar Orbit Insertion', details: 'Apollo 11 entered lunar orbit after a 76-hour journey from Earth, circling the Moon 30 times before the landing attempt.' },
      { year: 'July 20', event: 'Eagle Has Landed', details: 'At 4:17 PM EDT, the Lunar Module Eagle landed at the Sea of Tranquility. Neil Armstrong reported: "The Eagle has landed." Mission Control replied: "You got a bunch of guys about to turn blue. We\'re breathing again."' },
      { year: 'July 20', event: 'First Steps on the Moon', details: 'At 10:56 PM EDT, Neil Armstrong became the first human to walk on the Moon, saying: "That\'s one small step for [a] man, one giant leap for mankind." Buzz Aldrin joined him 20 minutes later.' },
      { year: 'July 21', event: 'Lunar Liftoff', details: 'The Eagle\'s ascent stage lifted off from the Moon at 1:54 PM EDT, leaving behind the descent stage, an American flag, and scientific equipment.' },
      { year: 'July 24', event: 'Splashdown', details: 'The Command Module Columbia splashed down in the Pacific Ocean at 12:50 PM EDT, completing humanity\'s first mission to land on another world. The crew was recovered by USS Hornet.' },
    ],
    narration: "I am Eagle - the Lunar Module of Apollo 11. On July 16, 1969, the most powerful rocket ever built, the Saturn V, roared to life and hurled us toward the Moon. Three astronauts were aboard: Neil Armstrong, Buzz Aldrin, and Michael Collins. After 76 hours of flight, we entered lunar orbit.\n\nThen Neil Armstrong and Buzz Aldrin climbed into me - Eagle - while Michael Collins remained in the Command Module Columbia, orbiting above. On July 20, 1969, at 4:17 PM Eastern Time, I touched down gently in the Sea of Tranquility. Neil Armstrong reported to Mission Control: 'The Eagle has landed.' Mission Control, holding their collective breath, exhaled with relief.\n\nHours later, Neil Armstrong opened my hatch and descended the ladder. As his boot touched the gray lunar dust, he spoke words that echoed across the world: 'That\'s one small step for a man, one giant leap for mankind.' Buzz Aldrin joined him, and together they planted an American flag, collected 21.5 kilograms of Moon rocks, and deployed scientific experiments. They walked on the Moon for 2 hours and 31 minutes.\n\nI had landed with less than 25 seconds of fuel remaining. The human race had reached the Moon.",
    quiz: [
      {
        question: 'Who was the first human to walk on the Moon?',
        options: ['Buzz Aldrin', 'Michael Collins', 'Neil Armstrong', 'John Glenn'],
        correctIndex: 2,
        explanation: 'Neil Armstrong was the first human to walk on the Moon on July 20, 1969, saying the famous words: "That\'s one small step for [a] man, one giant leap for mankind."',
      },
      {
        question: 'What did Armstrong and Aldrin collect from the Moon?',
        options: ['Nothing — they had no collection tools', '2.5 kg of moon dust', '21.5 kg of lunar rocks and soil', '100 kg of samples'],
        correctIndex: 2,
        explanation: 'Armstrong and Aldrin collected 21.5 kilograms (47.5 pounds) of lunar rocks, soil, and core samples during their 21+ hours on the lunar surface, providing scientists with invaluable material to study.',
      },
      {
        question: 'Where on the Moon did Apollo 11 land?',
        options: ['Oceanus Procellarum', 'Sea of Tranquility', 'Tycho Crater', 'Fra Mauro'],
        correctIndex: 1,
        explanation: 'Apollo 11 landed in the Sea of Tranquility (Mare Tranquillitatis), a vast flat basaltic plain chosen for its relatively smooth terrain and favorable lighting conditions.',
      },
      {
        question: 'What was the name of the Apollo 11 Lunar Module?',
        options: ['Columbia', 'Challenger', 'Eagle', 'Discovery'],
        correctIndex: 2,
        explanation: 'The Lunar Module was named Eagle, giving rise to Neil Armstrong\'s famous radio call "The Eagle has landed." The Command Module was named Columbia.',
      },
      {
        question: 'Which astronaut did NOT walk on the Moon during Apollo 11?',
        options: ['Neil Armstrong', 'Buzz Aldrin', 'Michael Collins', 'All three walked on the Moon'],
        correctIndex: 2,
        explanation: 'Michael Collins remained in the Command Module Columbia, orbiting the Moon while Armstrong and Aldrin descended to the surface. Collins orbited alone, out of contact with Earth for 48 minutes per orbit.',
      },
    ],
    chatbotFAQs: [
      { keywords: ['armstrong', 'neil', 'first', 'step', 'walk'], answer: 'Neil Armstrong was the commander of Apollo 11 and the first human to set foot on the Moon on July 20, 1969. His famous words as he stepped onto the lunar surface were: "That\'s one small step for [a] man, one giant leap for mankind." He and Buzz Aldrin explored the Moon for about 2.5 hours.' },
      { keywords: ['collins', 'michael', 'orbit', 'alone', 'command'], answer: 'Michael Collins was the Command Module Pilot. While Armstrong and Aldrin walked on the Moon, Collins orbited above in the Command Module "Columbia." For 48 minutes of each orbit, he was completely cut off from radio contact with Earth — the loneliest human in history at that moment.' },
      { keywords: ['saturn', 'rocket', 'launch', 'powerful', 'thrust'], answer: 'The Saturn V rocket that launched Apollo 11 was the most powerful rocket ever built! It stood 111 meters tall (taller than the Statue of Liberty) and generated 7.5 million pounds of thrust at liftoff. The launch was felt and heard by people 100 miles away.' },
      { keywords: ['rock', 'sample', 'collect', 'bring back', 'weight', 'kg'], answer: 'Armstrong and Aldrin collected 21.5 kilograms (47.5 pounds) of lunar rocks, soil, and core samples. These samples have been studied by scientists for decades and have taught us enormous amounts about the Moon\'s formation and the early solar system.' },
      { keywords: ['fuel', 'land', 'nearly', 'dangerous', 'almost', 'seconds'], answer: 'The landing was incredibly tense! As Eagle descended, the computer alarm went off, and the designated landing spot was full of boulders. Armstrong took manual control and flew Eagle to a safer spot, touching down with less than 25 seconds of fuel remaining. If they\'d had to abort, they might not have made it back to orbit.' },
      { keywords: ['flag', 'american', 'plant', 'planted'], answer: 'Armstrong and Aldrin planted an American flag on the lunar surface. The flag had a horizontal rod along the top to keep it extended since there is no wind on the Moon. Buzz Aldrin saluted it as Armstrong photographed the moment. Due to the blast from Eagle\'s ascent engine, the flag was likely blown over when they left.' },
    ],
    references: [
      { title: 'NASA Apollo 11 Lunar Mission Historic Overview', source: 'NASA History', url: 'https://www.nasa.gov/mission/apollo-11/' },
      { title: 'NASA NSSDC Master Catalog: Apollo 11 LM Eagle (1969-059C)', source: 'NASA NSSDC', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C' },
      { title: 'Apollo Lunar Surface Journal (ALSJ)', source: 'NASA JSC', url: 'https://www.nasa.gov/history/alsj/a11/' },
    ],
    photos: [
      {
        url: 'https://images-assets.nasa.gov/image/AS11-40-5874/AS11-40-5874~thumb.jpg',
        title: 'Buzz Aldrin Saluting Flag at Sea of Tranquility',
        caption: 'Astronaut Buzz Aldrin salutes the deployed U.S. flag on the lunar surface during Apollo 11 EVA.',
        date: '1969-07-20',
        credit: 'NASA / Neil Armstrong',
        nasaId: 'AS11-40-5874',
      },
      {
        url: 'https://images-assets.nasa.gov/image/AS11-40-5903/AS11-40-5903~thumb.jpg',
        title: 'Buzz Aldrin Visor Reflection',
        caption: 'Iconic photograph of Buzz Aldrin with Neil Armstrong and the Lunar Module Eagle reflected in his gold visor.',
        date: '1969-07-20',
        credit: 'NASA / Neil Armstrong',
        nasaId: 'AS11-40-5903',
      },
      {
        url: 'https://images-assets.nasa.gov/image/AS11-44-6581/AS11-44-6581~thumb.jpg',
        title: 'Lunar Module Eagle in Lunar Orbit',
        caption: 'LM Eagle in lunar orbit photographed by Michael Collins aboard the Command Module Columbia.',
        date: '1969-07-20',
        credit: 'NASA / Michael Collins',
        nasaId: 'AS11-44-6581',
      },
      {
        url: 'https://images-assets.nasa.gov/image/KSC-69PC-442/KSC-69PC-442~thumb.jpg',
        title: 'Saturn V Liftoff from Launch Complex 39A',
        caption: 'The giant 363-foot Saturn V rocket carrying Apollo 11 blasts off toward the Moon on July 16, 1969.',
        date: '1969-07-16',
        credit: 'NASA / KSC',
        nasaId: 'KSC-69PC-442',
      },
    ],
  },

  {
    id: 'spirit',
    slug: 'spirit',
    name: 'Spirit',
    subtitle: 'The Brave Rover of Gusev Crater',
    description: 'Spirit was a Mars Exploration Rover that operated for over 6 years, discovering evidence of ancient water activity in Gusev Crater before getting permanently stuck in soft Martian soil in 2010.',
    launchDate: 'June 10, 2003',
    endDate: 'March 22, 2010',
    color: '#ef4444',
    accentColor: '#fca5a5',
    position: [-5, -3, -10],
    environment: 'mars-surface',
    facts: [
      'Spirit was designed for 90 days but operated for 2,208 Martian sols (over 6 years)',
      'Spirit climbed the Columbia Hills — a range named after the Space Shuttle Columbia crew',
      'It discovered silica-rich soil at Home Plate indicating past hydrothermal activity',
      'Spirit got permanently stuck in a sand trap called "Troy" in May 2009',
      'Its right front wheel stopped working in 2006, so it drove backwards, accidentally making a great discovery',
    ],
    achievements: [
      'Found volcanic rocks altered by liquid water in the Columbia Hills',
      'Discovered bright silica-rich soil at "Home Plate" indicating past hydrothermal vents or steam',
      'Survived a software reset crisis that nearly ended the mission in 2004',
      'Operated 24x longer than its planned 90-day mission',
      'Found the first mineralogical evidence of hydrothermal activity on Mars',
      'Photographed dust devils and tracked Martian weather for years',
    ],
    components: [
      { name: 'Solar Panels', description: 'Two folding solar panel wings, identical to Opportunity\'s, generating up to 900 watt-hours per day' },
      { name: 'Panoramic Camera (Pancam)', description: 'Stereo color cameras on a mast, providing detailed panoramic images of the surrounding terrain' },
      { name: 'Miniature Thermal Emission Spectrometer', description: 'Identifies rocks and soils from a distance by analyzing infrared light they emit' },
      { name: 'Rock Abrasion Tool', description: 'Diamond-tipped grinding tool for exposing fresh rock surfaces for analysis' },
      { name: 'Six-Wheel Drive System', description: 'Independently powered wheels providing excellent traction on loose Martian soil' },
      { name: 'High-Gain Antenna', description: 'Steerable dish antenna for direct communication with Earth at high data rates' },
    ],
    timeline: [
      { year: '2003', event: 'Launch', details: 'Spirit launched on June 10, 2003, from Cape Canaveral aboard a Delta II rocket — three weeks before its twin rover Opportunity.' },
      { year: '2004', event: 'Landing at Gusev Crater', details: 'Spirit landed on January 4, 2004, inside Gusev Crater — a large impact basin thought to have once held a lake. The landing involved airbags and took place at night.' },
      { year: '2004', event: 'Software Crisis', details: 'Just weeks after landing, Spirit experienced a severe software glitch that left it continuously rebooting. NASA engineers worked around the clock and saved the mission within days.' },
      { year: '2004', event: 'Columbia Hills', details: 'Spirit drove to the Columbia Hills and found volcanic rocks altered by liquid water — the first direct evidence of past water activity it discovered.' },
      { year: '2007', event: 'Silica Discovery', details: 'Spirit\'s broken right wheel dragged through soil near Home Plate, accidentally uncovering bright silica-rich material — a sign of ancient hydrothermal activity, possibly hot springs.' },
      { year: '2009', event: 'Stuck at Troy', details: 'In May 2009, Spirit\'s wheels broke through a Martian crust and sank into soft sulfate soil at a location called Troy. Despite months of attempts, NASA could not free Spirit.' },
      { year: '2010', event: 'Last Contact', details: 'Spirit\'s last communication with Earth was on March 22, 2010. NASA continued to listen for a signal until May 2011, when the mission was officially declared complete.' },
    ],
    narration: "I am Spirit, one of the two Mars Exploration Rovers. I launched on June 10, 2003, and landed on the Martian surface on January 4, 2004, inside Gusev Crater - a vast impact basin that scientists believed once held an ancient lake. My mission was planned for 90 Martian days. I lasted more than 2,200.\n\nIn my early weeks, disaster nearly struck. My computer began rebooting endlessly, and I fell silent for days. My engineers back on Earth worked tirelessly and found the problem - a software issue - and brought me back to life. I explored the floor of Gusev Crater and then climbed the Columbia Hills, named in honor of the Space Shuttle Columbia crew lost in 2003. In those hills, I found something remarkable: volcanic rocks that had been soaked and altered by liquid water billions of years ago.\n\nThen my right front wheel stopped working. Rather than give up, my engineers drove me backwards, dragging the broken wheel. That dragging wheel accidentally scraped through the Martian crust near a place called Home Plate and exposed something extraordinary: bright white silica soil. Silica like this forms near hydrothermal vents or steam. Mars once had hot springs.\n\nIn May 2009, my wheels broke through a crust of soil and I sank into soft ground at a place called Troy. I was stuck. My engineers tried everything to free me for months. My last communication with Earth was March 22, 2010. I had given everything I had to understand Mars.",
    quiz: [
      {
        question: 'Where did Spirit land on Mars?',
        options: ['Meridiani Planum', 'Olympus Mons', 'Gusev Crater', 'Valles Marineris'],
        correctIndex: 2,
        explanation: 'Spirit landed in Gusev Crater on January 4, 2004. Scientists chose this location because the crater was believed to have once held an ancient lake, making it a good place to look for evidence of past water.',
      },
      {
        question: 'What accidental discovery did Spirit make with its broken wheel?',
        options: [
          'A hidden underground river',
          'Silica-rich soil indicating ancient hydrothermal activity',
          'Frozen water ice just below the surface',
          'An ancient meteorite buried in Martian soil',
        ],
        correctIndex: 1,
        explanation: 'When Spirit\'s right front wheel stopped working, engineers drove it backwards, dragging the broken wheel. This accidentally exposed bright silica-rich soil near Home Plate — a sign of ancient hydrothermal activity like hot springs.',
      },
      {
        question: 'What was the "Columbia Hills" named after?',
        options: [
          'Columbia University in New York',
          'Columbia River in the Pacific Northwest',
          'The Space Shuttle Columbia crew lost in 2003',
          'Columbia, the Apollo 11 Command Module',
        ],
        correctIndex: 2,
        explanation: 'The Columbia Hills were named in honor of the seven crew members of Space Shuttle Columbia who lost their lives when the shuttle broke apart during re-entry on February 1, 2003.',
      },
      {
        question: 'What ended Spirit\'s mission in 2010?',
        options: [
          'A massive Martian dust storm destroyed it',
          'Its computer permanently failed',
          'It got permanently stuck in soft Martian soil',
          'NASA deliberately drove it into a crater',
        ],
        correctIndex: 2,
        explanation: 'In May 2009, Spirit\'s wheels broke through a brittle Martian soil crust and sank into deep soft sulfate deposits at a location called Troy. Despite months of recovery attempts, Spirit could not be freed, and its last transmission was March 22, 2010.',
      },
      {
        question: 'What crisis almost ended Spirit\'s mission just weeks after landing?',
        options: [
          'A large rock punctured one of its wheels',
          'A dust storm buried its solar panels',
          'A severe software glitch caused continuous rebooting',
          'It drove off a cliff and was stranded',
        ],
        correctIndex: 2,
        explanation: 'Just weeks after landing, Spirit suffered a severe software glitch that caused it to endlessly reboot and go largely silent. NASA engineers worked around the clock for days and successfully resolved the issue, saving the mission.',
      },
    ],
    chatbotFAQs: [
      { keywords: ['columbia hills', 'hills', 'named', 'shuttle'], answer: 'The Columbia Hills are a small range of hills I explored inside Gusev Crater. They were named after the Space Shuttle Columbia crew — seven brave astronauts who died when Columbia broke apart during re-entry on February 1, 2003. It was a meaningful way to honor their memory.' },
      { keywords: ['silica', 'white', 'bright', 'home plate', 'hydrothermal', 'hot spring'], answer: 'Near a place called Home Plate, my broken wheel accidentally scraped through the Martian crust and exposed something amazing — bright white silica-rich soil. On Earth, silica like this forms near hydrothermal vents or steam fumaroles. This discovery suggested that ancient Mars had hot springs or steam rising from underground, which could have been habitable environments for microbial life!' },
      { keywords: ['stuck', 'troy', 'wheel', 'sand', 'free', 'rescue'], answer: 'In May 2009, I drove over what appeared to be normal Martian soil near a location called Troy. But the surface was just a thin crust hiding deep, loose sulfate soil underneath. My wheels broke through and I sank. My engineers tried for months to get me out, testing different drive strategies on a replica rover on Earth. But Mars had won that round. I was permanently embedded there.' },
      { keywords: ['software', 'glitch', 'reboot', 'crisis', 'computer', 'memory'], answer: 'Just a few weeks after I landed, disaster struck! My computer\'s flash memory became corrupted, and I started rebooting over and over, unable to do anything useful. I went almost silent. My engineering team worked for days without sleep and found the problem. They sent commands to fix my software and I came back online. It was a close call!' },
      { keywords: ['twin', 'opportunity', 'sister', 'brother', 'other rover'], answer: 'Opportunity was my twin! We were both Mars Exploration Rovers, launched just three weeks apart in 2003. While I explored Gusev Crater, Opportunity explored Meridiani Planum on the other side of Mars. We were identical in design but had very different adventures. Opportunity survived 15 years; I lasted over 6.' },
    ],
    references: [
      { title: 'Mars Exploration Rover Spirit Official Mission', source: 'NASA JPL', url: 'https://mars.nasa.gov/mer/mission/spacecraft/surface/spirit/' },
      { title: 'NASA NSSDC Master Catalog: Spirit (2003-027A)', source: 'NASA NSSDC', url: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=2003-027A' },
      { title: 'NASA JPL Spirit Scientific Discoveries Archive', source: 'NASA JPL', url: 'https://www.jpl.nasa.gov/missions/mars-exploration-rover-spirit-mer' },
    ],
    photos: [
      {
        url: 'https://images-assets.nasa.gov/image/PIA05211/PIA05211~thumb.jpg',
        title: 'Spirit Panorama of Gusev Crater Floor',
        caption: 'First full 360-degree color panoramic view captured by Spirit across the plains of Gusev Crater.',
        date: '2004-01-12',
        credit: 'NASA / JPL-Caltech / Cornell',
        nasaId: 'PIA05211',
      },
      {
        url: 'https://images-assets.nasa.gov/image/PIA09403/PIA09403~thumb.jpg',
        title: 'Bright White Silica Soil at Home Plate',
        caption: 'Spirit dragged broken front-right wheel exposing 90% pure hydrothermal silica soil, evidence of past hot springs.',
        date: '2007-05-18',
        credit: 'NASA / JPL-Caltech / Cornell',
        nasaId: 'PIA09403',
      },
      {
        url: 'https://images-assets.nasa.gov/image/PIA07212/PIA07212~thumb.jpg',
        title: 'Columbia Hills Vista from Husband Hill',
        caption: 'Summit vista photographed by Spirit looking down across Gusev Crater basin from Husband Hill.',
        date: '2005-08-23',
        credit: 'NASA / JPL-Caltech / Cornell',
        nasaId: 'PIA07212',
      },
      {
        url: 'https://images-assets.nasa.gov/image/PIA05557/PIA05557~thumb.jpg',
        title: 'Spirit Wheel Tracks in Martian Dust',
        caption: 'Rear Hazcam image showing twin tracks left behind by Spirit as it journeyed into the Columbia Hills.',
        date: '2004-02-14',
        credit: 'NASA / JPL-Caltech',
        nasaId: 'PIA05557',
      },
    ],
  },

  {
    id: 'lunar-rover',
    slug: 'lunar-rover',
    name: 'Lunar Roving Vehicle',
    subtitle: 'The Moon Buggy',
    description: 'The Lunar Roving Vehicle (LRV) was an electric vehicle used on the Moon during Apollo missions 15, 16, and 17 (1971–1972), dramatically expanding the range and scientific return of each mission.',
    launchDate: 'July 26, 1971 (Apollo 15)',
    endDate: null,
    color: '#a3e635',
    accentColor: '#d9f99d',
    position: [4, 4, -6],
    environment: 'moon',
    facts: [
      'The LRV could travel up to 13 km/h (8 mph) across the lunar surface',
      'Each LRV could only travel 9.6 km from the Lunar Module (walkback limit for safety)',
      'The Apollo 17 LRV traveled the most: 35.9 km total in three traverses',
      'All three LRVs remain on the Moon today and can be seen in satellite imagery',
      'The LRV was designed, built, and tested in just 17 months',
    ],
    achievements: [
      'Dramatically expanded astronaut exploration range from hundreds of meters to tens of kilometers',
      'Apollo 15 LRV enabled collection of the "Genesis Rock" — 4-billion-year-old anorthosite',
      'Apollo 17 LRV enabled the longest crewed lunar surface operations in history',
      'Gene Cernan\'s LRV fender repair using maps and clamps became a legendary problem-solving moment',
      'Allowed astronauts to carry hundreds of kilograms of equipment and samples',
      'The three LRVs together covered about 90 km of lunar surface',
    ],
    components: [
      { name: 'Chassis', description: 'Folding T-shaped aluminum frame that unfolded automatically when deployed from the Lunar Module descent stage' },
      { name: 'Electric Motors', description: 'Four quarter-horsepower electric motors — one in each wheel hub — powered by two 36-volt silver-zinc potassium hydroxide batteries' },
      { name: 'Wire Mesh Wheels', description: 'Titanium wire mesh wheels with zinc-coated piano wire treads, designed to work in extreme lunar temperature swings from -173°C to 127°C' },
      { name: 'Navigation System', description: 'Dead-reckoning navigation using gyroscope and odometer, always showing direction and distance back to Lunar Module' },
      { name: 'Communication System', description: 'High-gain dish antenna and TV camera allowing live video transmission from the Moon back to Earth' },
      { name: 'Tool and Sample Carriers', description: 'Storage racks, bags, and holders for geological tools, sample containers, cameras, and life-support equipment' },
    ],
    timeline: [
      { year: 'Jul 1969', event: 'Contract Awarded', details: 'NASA awarded the LRV development contract to Boeing in July 1969, just days after Apollo 11 landed on the Moon. The design had to be completed in 17 months — an extraordinary engineering challenge.' },
      { year: 'Jul 1971', event: 'Apollo 15 — First Use', details: 'The first LRV was used on Apollo 15 (July 30 – August 2, 1971). Astronauts David Scott and James Irwin drove 27.9 km total, collecting 77 kg of samples including the famous "Genesis Rock" estimated at 4 billion years old.' },
      { year: 'Apr 1972', event: 'Apollo 16 — Descartes Highlands', details: 'The Apollo 16 LRV traveled 26.7 km across the Descartes Highlands, the first LRV mission to the lunar highlands. John Young and Charles Duke drove it to Plum Crater, Stone Mountain, and other landmarks.' },
      { year: 'Dec 1972', event: 'Apollo 17 — Record Drive', details: 'The Apollo 17 LRV — the last Moon buggy ever driven — covered 35.9 km, the most of any LRV. Harrison Schmitt (the first scientist-astronaut on the Moon) and Gene Cernan explored the Taurus-Littrow valley. The famous orange soil was discovered.' },
      { year: 'Dec 1972', event: 'Fender Repair', details: 'Gene Cernan accidentally broke the LRV\'s rear fender on Apollo 17. Without it, moon dust coated the astronauts and equipment. Using laminated maps and clamps from inside the cabin, they improvised a replacement fender — a legendary in-space fix.' },
      { year: 'Present', event: 'Still on the Moon', details: 'All three LRVs remain on the Moon exactly where they were left. Modern lunar orbiters like NASA\'s Lunar Reconnaissance Orbiter have photographed the Apollo landing sites from orbit, showing the LRVs and even the astronaut footpaths.' },
    ],
    narration: "I am the Lunar Roving Vehicle - astronauts called me the Moon Buggy. I was born out of a challenge: Apollo astronauts could only explore a few hundred meters from their Lunar Module on foot. If humans were going to truly explore the Moon, they needed wheels. NASA awarded Boeing a contract to build me in July 1969 - just days after Apollo 11 landed - and engineers had only 17 months to design, build, and test me. That is remarkably fast for a vehicle meant to operate in one of the harshest environments in the solar system.\n\nOn July 30, 1971, astronauts David Scott and James Irwin of Apollo 15 unfolded me from the Lunar Module and drove me across the Moon's surface for the first time. I could reach 13 kilometers per hour across lunar terrain, though my drivers usually went more carefully over the rocky ground. My wheels were made of titanium wire mesh - solid rubber would crack in the extreme lunar temperatures ranging from negative 173 degrees to positive 127 degrees Celsius. I had no steering wheel - just a hand controller in the center console.\n\nDuring Apollo 15, my crew found the Genesis Rock - a 4-billion-year-old piece of the Moon's original crust. During Apollo 17, Gene Cernan accidentally broke my rear fender, and moon dust began coating everything. Using laminated maps and equipment clamps from inside the cabin, the astronauts improvised a replacement fender. Pure ingenuity.\n\nAll three versions of me still sit on the Moon today, exactly where they were left.",
    quiz: [
      {
        question: 'Which Apollo missions used the Lunar Roving Vehicle?',
        options: [
          'Apollo 11, 12, and 13',
          'Apollo 14, 15, and 16',
          'Apollo 15, 16, and 17',
          'Apollo 16, 17, and 18',
        ],
        correctIndex: 2,
        explanation: 'The LRV was used on Apollo 15 (July 1971), Apollo 16 (April 1972), and Apollo 17 (December 1972). Earlier Apollo missions traveled on foot due to limited range from the Lunar Module.',
      },
      {
        question: 'What were the LRV\'s wheels made of?',
        options: [
          'Solid rubber like car tires',
          'Titanium wire mesh with zinc-coated piano wire treads',
          'Hard plastic reinforced with carbon fiber',
          'Foam-filled pneumatic tires',
        ],
        correctIndex: 1,
        explanation: 'The LRV\'s wheels were made of titanium wire mesh with zinc-coated piano wire treads. Rubber tires would have cracked in the Moon\'s extreme temperatures (from -173°C to 127°C), so this innovative design was used instead.',
      },
      {
        question: 'What was the "walkback limit" that restricted how far the LRV could travel?',
        options: ['5 km', '9.6 km', '15 km', '25 km'],
        correctIndex: 1,
        explanation: 'The LRV could only travel 9.6 km from the Lunar Module — the "walkback limit." This ensured that if the rover broke down at its farthest point, astronauts could walk back to the Lunar Module with enough oxygen in their suits to survive.',
      },
      {
        question: 'What important rock did the Apollo 15 LRV crew discover?',
        options: [
          'A large meteorite from outside the solar system',
          'Iron-rich basalt similar to Hawaii\'s lava rocks',
          'The "Genesis Rock" — 4-billion-year-old anorthosite from the Moon\'s original crust',
          'The first evidence of past water ice on the Moon',
        ],
        correctIndex: 2,
        explanation: 'During Apollo 15, astronauts David Scott and James Irwin discovered the "Genesis Rock" — a piece of anorthosite estimated at 4 billion years old, thought to be part of the Moon\'s original crust when it formed from a magma ocean.',
      },
      {
        question: 'Where are the three LRVs today?',
        options: [
          'All returned to Earth and displayed in NASA museums',
          'Crashed into the Moon\'s surface during the missions',
          'Still on the Moon where they were left',
          'Burned up re-entering Earth\'s atmosphere',
        ],
        correctIndex: 2,
        explanation: 'All three LRVs remain on the Moon exactly where they were left. The astronauts drove away and left them behind when departing in the Lunar Module. NASA\'s Lunar Reconnaissance Orbiter has photographed the vehicles from orbit.',
      },
    ],
    chatbotFAQs: [
      { keywords: ['wheel', 'tire', 'wire', 'mesh', 'rubber'], answer: 'My wheels are made of titanium wire mesh with zinc-coated piano wire treads — not rubber! Rubber would have cracked in the Moon\'s extreme temperatures, which swing from -173°C at night to +127°C in sunlight. The wire mesh design was flexible, grippy, and completely immune to flat tires since there\'s no air to deflate!' },
      { keywords: ['speed', 'fast', 'mph', 'km/h', 'quick'], answer: 'My top speed was about 13 km/h (8 mph) on smooth terrain. But astronauts usually drove much more carefully — around 8-10 km/h — because the lunar surface is covered in craters, rocks, and rough terrain. At lunar gravity (1/6 of Earth\'s), bumps feel very different. Gene Cernan reportedly described driving me as like being in a constant "bucking bronco" ride!' },
      { keywords: ['genesis rock', 'rock', 'sample', 'collect', 'important'], answer: 'During Apollo 15, astronauts Dave Scott and Jim Irwin found what they called the "Genesis Rock" — a beautiful white crystalline rock later confirmed to be anorthosite about 4 billion years old. It\'s thought to be a piece of the Moon\'s original crust, formed when a global magma ocean solidified. It\'s one of the most scientifically valuable lunar samples ever collected.' },
      { keywords: ['fender', 'broke', 'repair', 'cernan', 'dust', 'map'], answer: 'On Apollo 17, Gene Cernan accidentally caught his spacesuit hammer on the right rear fender and broke it off. Without the fender, rooster tails of moon dust sprayed all over the astronauts and equipment, clogging everything. The fix was brilliantly improvised: they taped laminated maps from inside the Lunar Module together and clamped them onto the fender support. It worked perfectly for the rest of the mission!' },
      { keywords: ['still there', 'on moon', 'left behind', 'remains', 'photograph'], answer: 'Yes! All three of us — the Apollo 15, 16, and 17 LRVs — are still sitting on the Moon exactly where they were parked over 50 years ago. The Moon has no weather, no wind, and no rust, so we\'re perfectly preserved. NASA\'s Lunar Reconnaissance Orbiter has actually photographed all the Apollo landing sites from orbit and you can see the rovers, the descent stages, and even the astronaut footpaths!' },
    ],
    references: [
      { title: 'NASA Lunar Roving Vehicle Operations Handbook', source: 'NASA Marshall', url: 'https://www.nasa.gov/history/alsj/lrv.html' },
      { title: 'NASA NSSDC Master Catalog: Apollo 15 LRV-1', source: 'NASA NSSDC', url: 'https://nssdc.gsfc.nasa.gov/planetary/lunar/apollo_lrv.html' },
      { title: 'NASA Apollo Lunar Surface Journal (LRV Documentation)', source: 'NASA JSC', url: 'https://www.nasa.gov/missions/apollo/the-apollo-lunar-roving-vehicle/' },
    ],
    photos: [
      {
        url: 'https://images-assets.nasa.gov/image/AS17-147-22527/AS17-147-22527~thumb.jpg',
        title: 'Gene Cernan and LRV on Apollo 17',
        caption: 'Astronaut Gene Cernan stands by the Lunar Roving Vehicle showing the taped map improvised rear fender repair.',
        date: '1972-12-12',
        credit: 'NASA / Harrison Schmitt',
        nasaId: 'AS17-147-22527',
      },
      {
        url: 'https://images-assets.nasa.gov/image/AS15-88-11901/AS15-88-11901~thumb.jpg',
        title: 'Dave Scott Drives LRV Near Hadley Rille',
        caption: 'Apollo 15 Commander Dave Scott tests the Lunar Roving Vehicle near the 1,000-foot-deep canyon of Hadley Rille.',
        date: '1971-08-01',
        credit: 'NASA / James Irwin',
        nasaId: 'AS15-88-11901',
      },
      {
        url: 'https://images-assets.nasa.gov/image/AS16-107-17446/AS16-107-17446~thumb.jpg',
        title: 'John Young Jumping Salute with LRV',
        caption: 'Astronaut John Young leaps off the lunar surface in 1/6 gravity during Apollo 16 with LRV parked behind.',
        date: '1972-04-21',
        credit: 'NASA / Charles Duke',
        nasaId: 'AS16-107-17446',
      },
      {
        url: 'https://images-assets.nasa.gov/image/AS15-85-11471/AS15-85-11471~thumb.jpg',
        title: 'LRV Parked Beside Lunar Module Falcon',
        caption: 'The Lunar Roving Vehicle deployed and parked near Apollo 15 Lunar Module Falcon against Mount Hadley Delta.',
        date: '1971-07-31',
        credit: 'NASA / Dave Scott',
        nasaId: 'AS15-85-11471',
      },
    ],
  },
]

export const getMissionById = (id: string): Mission | undefined =>
  MISSIONS.find(m => m.id === id)

export const getMissionBySlug = (slug: string): Mission | undefined =>
  MISSIONS.find(m => m.slug === slug)
