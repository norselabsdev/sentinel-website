// ─── Asset URL map ───
// Every runtime asset the page loads, now stored as a separate static file
// under public/assets/. In the original single-file bundle these were
// gzip+base64 blobs resolved to blob: URLs via window.__resources; here they
// resolve to plain file paths served by Astro. The keys match the resource
// ids the components reference (window.__resources.<id>).

export const RESOURCES: Record<string, string> = {
  // Hero / textures
  heroVideo: '/assets/media/heroVideo.mp4',
  ambientMusic: '/assets/media/ambient-music.mp3',
  noiseBg: '/assets/img/noiseBg.png',
  meshBg: '/assets/img/meshBg.png',

  // Product screenshots
  screenPlan1: '/assets/img/screenPlan1.png',
  screenPlan2: '/assets/img/screenPlan2.jpg',
  screenPlan3: '/assets/img/screenPlan3.png',
  screenNode1: '/assets/img/screenNode1.jpg',
  screenNode2: '/assets/img/screenNode2.jpg',
  screenNode3: '/assets/img/screenNode3.jpg',

  // Supporter logos
  logoFetch: '/assets/img/logoFetch.svg',
  logoGalaxy: '/assets/img/logoGalaxy.svg',
  logoTrgc: '/assets/img/logoTrgc.svg',
  logoCosmos: '/assets/img/logoCosmos.svg',

  // Payment rails
  payUsdc: '/assets/img/payUsdc.svg',
  payMoonpay: '/assets/img/payMoonpay.svg',
  payEthereum: '/assets/img/payEthereum.svg',
  payCoinbase: '/assets/img/payCoinbase.svg',
  payX402: '/assets/img/payX402.svg',
  payGoogle: '/assets/img/payGoogle.svg',
  payApple: '/assets/img/payApple.svg',
  payBitcoin: '/assets/img/payBitcoin.svg',
  payStripe: '/assets/img/payStripe.svg',

  // Ecosystem apps
  ecoEncryptsim: '/assets/img/ecoEncryptsim.svg',
  ecoValt: '/assets/img/ecoValt.svg',
  ecoNorse: '/assets/img/ecoNorse.svg',
  ecoSentinelShield: '/assets/img/ecoSentinelShield.svg',
  ecoIndependent: '/assets/img/ecoIndependent.svg',
  ecoRyn: '/assets/img/ecoRyn.png',
  ecoMeile: '/assets/img/ecoMeile.png',

  // Compare
  cmpI2p: '/assets/img/cmpI2p.svg',
};
