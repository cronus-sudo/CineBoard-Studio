export interface SampleScript {
  id: string;
  title: string;
  genre: string;
  synopsis: string;
  content: string;
  recommendedStyle: string;
}

export const SAMPLE_SCRIPTS: SampleScript[] = [
  {
    id: "cyberpunk-rain",
    title: "NEO-SHINJUKU 2099",
    genre: "Cyberpunk / Neo-Noir",
    synopsis: "Detective Kael tracks a synthetic informant through a rain-drenched neon alleyway.",
    recommendedStyle: "Neo-Cyberpunk & Neon Noir",
    content: `EXT. NEO-SHINJUKU ALLEY - NIGHT

Acid rain slants through holographic advertisements of giant geishas and synthetic whiskey. Neon reflections fracture in oily puddles.

DETECTIVE KAEL (40s, ragged trenchcoat, cybernetic right eye glowing faint amber) stands under a rusted fire escape. Smoke curls from his neural-vape.

He checks his wrist-comm. A blinking crimson dot pulses: TARGET 30 METERS.

KAEL
(whispering into comm)
I have visual on the alleyway entrance. Moving in.

Down the alley, NYX (20s, chrome cyber-limbs, drenched leather hood) emerges from the steam exhaust. She clutches an encrypted quantum data core.

Suddenly, Nyx freezes. She senses Kael.

NYX
You shouldn't have followed me, Detective. The Syndicate already knows you have the key.

She drops a flash-pellet. BLINDING MAGENTA LIGHT errupts. Nyx sprints up the fire escape, her cyber-boots sparking against iron railings.

Kael draws his heavy particle revolver, shielding his human eye from the glare, and charges into the steam.`,
  },
  {
    id: "deep-space",
    title: "THE HORIZON PROTOCOL",
    genre: "Hard Sci-Fi / Cosmic Wonder",
    synopsis: "Astronaut Elena discovers a massive geometric artifact resting within Saturn's crystalline rings.",
    recommendedStyle: "IMAX Sci-Fi Hyperrealism",
    content: `EXT. DEEP SPACE - SATURN'S RINGS

Infinite fields of icy asteroids sparkle like suspended diamonds in the harsh glare of the distant Sun. Saturn's golden gas bands dominate the background.

DRIFTING ALONE: COMMANDER ELENA VANCE (30s, pressurized exploration EVA suit with reflective gold visor).

Tethered to the research shuttle 'AURA', her maneuvering thrusters emit tiny white bursts of nitrogen gas.

ELENA (O.S.)
(through suit radio, breathing steady)
Telemetry confirmed, Aura Control. I have cleared the ice shelf. Approaching coordinate zero.

Elena turns. Her visor catches a blinding reflection.

A colossal OBSIDIAN MONOLITH—three kilometers tall, perfectly polished and carved with glowing cobalt circuit glyphs—hovers motionless amidst the rotating debris.

ELENA (O.S.)
Control... are you receiving this feed? It's not an asteroid. It's... it's architectural.

The monolith's surface ripples like liquid mercury. A soft, low-frequency hum vibrates through the icy space dust, causing miniature crystals to dance around Elena's outstretched glove.`,
  },
  {
    id: "western-duel",
    title: "HIGH NOON IN RED DUST",
    genre: "Western / Thriller",
    synopsis: "Two legendary gunfighters face off in the baking heat of a ghost town street.",
    recommendedStyle: "Vintage Technicolor 1970s Grain",
    content: `EXT. RED DUST MAIN STREET - HIGH NOON

The Arizona desert sun beats down mercilessly on weathered wooden clapboards. A tumbleweed rolls across cracked clay.

SILAS GREY (50s, scarred cheek, battered Stetson, worn leather holster) stands alone in the dead center of the street. Sweat trickles down his temple.

Thirty yards away: 'BLACK JACK' CALLAHAN (30s, immaculate black duster, twin pearl-handled Colts). Callahan's eyes are cold as flint.

A wooden tavern sign creaks in the dry wind.

SILAS
Town's empty, Jack. Nobody left to save you this time.

CALLAHAN
(smiles thinly)
Only one man needs saving today, old timer. And he's standing in my boots.

Extreme Close Up on Silas's right hand hovering an inch above the hammer of his Peacemaker.
Extreme Close Up on Callahan's ice-blue eyes narrowing.

A church bell toll: DONG.

Both hands blur in blinding motion. DUST EXPLODES.`,
  },
  {
    id: "noir-detective",
    title: "SHADOWS IN ROOM 404",
    genre: "Classic Film Noir",
    synopsis: "A private eye's quiet evening is interrupted by a mysterious dame bearing a sealed ledger.",
    recommendedStyle: "Classic Film Noir Black & White Chiaroscuro",
    content: `INT. MARLOWE'S OFFICE - DUSK

Venetian blinds slice the setting California sun into sharp zebra stripes across mahogany desks and stacks of unpaid bills.

PHILIP MARLOWE (35, unbuttoned collar, loosened tie) sits with feet propped on the desk, nursing two fingers of cheap rye. A ceiling fan lazily chops the cigarette smoke.

The frosted glass door reads: P. MARLOWE - PRIVATE INVESTIGATIONS.

A sharp, rapid KNOCK: TAP-TAP-TAP.

Before he can answer, the door swings open.

Standing in the silhouette of the hallway light is EVELYN CARTER (late 20s, veiled pillbox hat, tailored emerald coat, emerald eyes rimmed with unspoken dread).

EVELYN
Mr. Marlowe? I was told you were the only man in this city who couldn't be bought.

MARLOWE
(puts down the glass)
That depends on who's doing the selling, lady. And what you're running from.

She steps into the light, setting a bloodstained leather ledger squarely in front of him.`,
  },
];
