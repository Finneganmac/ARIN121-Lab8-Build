export interface SampleTopic {
  title: string;
  tag: string;
  content: string;
}

export const SAMPLE_NOTES: SampleTopic[] = [
  {
    title: 'Cellular Biology: Photosynthesis',
    tag: 'Biology',
    content: `Photosynthesis is the process used by plants, algae, and cyanobacteria to convert light energy into chemical energy stored in carbohydrates like glucose. The chemical equation is 6CO2 + 6H2O + light energy -> C6H12O6 + 6O2.

It takes place within chloroplasts in plant cells. Chloroplasts contain chlorophyll, a pigment located in thylakoid membranes that absorbs blue and red light while reflecting green light.

Photosynthesis has two primary stages:
1. Light-Dependent Reactions: Take place in the thylakoid membranes. Solar photons excite electrons in chlorophyll, driving water photolysis (H2O splitting), producing oxygen (O2) as a byproduct, and creating ATP and NADPH.
2. Light-Independent Reactions (Calvin Cycle): Take place in the stroma. The key enzyme RuBisCO facilitates carbon fixation, incorporating CO2 into organic molecules to produce glyceraldehyde 3-phosphate (G3P), which eventually forms glucose.`,
  },
  {
    title: 'Computer Networking: Transport & Network Layers',
    tag: 'Computer Science',
    content: `The OSI model organizes network communications into seven layers.
Layer 3 (Network Layer) is responsible for logical addressing, path determination, and packet forwarding across different networks. Key protocols include IPv4 and IPv6. Routers are the primary hardware devices operating at Layer 3.

Layer 4 (Transport Layer) provides transparent transfer of data between end users. The two dominant protocols are:
- Transmission Control Protocol (TCP): A connection-oriented, reliable protocol providing guaranteed delivery, error checking, flow control, and ordered sequencing. Connection setup uses a three-way handshake: SYN, SYN-ACK, and ACK.
- User Datagram Protocol (UDP): A connectionless, lightweight protocol designed for speed and low latency (used in VoIP, DNS, and video streaming) with no acknowledgment or retransmission.`,
  },
  {
    title: 'World History: The Silk Road',
    tag: 'History',
    content: `The Silk Road was an ancient network of trade routes connecting East Asia with the Mediterranean world, officially opened during the Han dynasty of China around 130 BCE and utilized until the Ottoman Empire boycotted trade with the West in the 1450s.

Covering over 6,400 kilometers (4,000 miles), merchant caravans traded luxury goods including Chinese silk, porcelain, tea, Indian spices, Persian rugs, and Roman glassware.

Beyond merchandise, the Silk Road was a vital conduit for cultural and technological exchange:
- Religious diffusion: Buddhism spread from northern India into Central Asia and China.
- Technological transfers: Crucial Chinese inventions like paper-making, the magnetic compass, and gunpowder were transmitted to the Islamic world and eventually Europe.`,
  },
];
