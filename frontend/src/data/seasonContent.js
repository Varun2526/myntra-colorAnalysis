// Editorial content keyed by the season/undertone labels the model predicts.
// Pure data — no React. Keeps copy out of the components.

export const SEASON_CONTENT = {
  spring: {
    title: 'Spring',
    tagline: 'Fresh, warm and luminous',
    description:
      'Your coloring is bright and warm, like the first weeks of spring. Clear, sunlit shades bring out your natural glow, while heavy dark tones can overpower you.',
    tips: [
      { title: 'Lead with light, warm brights', text: 'Coral, peach, golden yellow and fresh greens mirror your natural warmth.' },
      { title: 'Keep contrast gentle', text: 'Pair light neutrals like ivory and camel instead of harsh black.' },
      { title: 'Choose gold-tone accents', text: 'Gold jewellery, tan bags and warm-toned sneakers finish the look.' },
      { title: 'Prints that pop', text: 'Small, cheerful prints on light backgrounds suit your brightness.' },
    ],
  },
  summer: {
    title: 'Summer',
    tagline: 'Soft, cool and elegant',
    description:
      'Your coloring is cool and delicate, like a hazy summer sky. Muted, powdery shades harmonise with you, while loud saturated colors compete with your softness.',
    tips: [
      { title: 'Stay soft and muted', text: 'Powder blue, lavender, dusty rose and sage keep you luminous.' },
      { title: 'Cool your neutrals', text: 'Soft white, grey and taupe flatter more than warm browns.' },
      { title: 'Silver over gold', text: 'Silver and white-gold jewellery echo your cool undertone.' },
      { title: 'Blend, don’t clash', text: 'Tonal outfits in adjacent pastels look effortlessly polished.' },
    ],
  },
  autumn: {
    title: 'Autumn',
    tagline: 'Rich, warm and earthy',
    description:
      'Your coloring is warm and deep, like autumn foliage. Earthy, spiced shades make your skin glow, while icy pastels and stark black can wash you out.',
    tips: [
      { title: 'Embrace earth tones', text: 'Rust, olive, camel and chocolate are your power colors for everyday wear.' },
      { title: 'Go gold', text: 'Gold jewellery and warm metallic accents flatter your warm undertone far more than silver.' },
      { title: 'Swap black for brown', text: 'Deep chocolate or espresso reads richer against your skin than harsh black.' },
      { title: 'Layer warm textures', text: 'Suede, corduroy and knits in spiced tones amplify your autumn depth.' },
    ],
  },
  winter: {
    title: 'Winter',
    tagline: 'Bold, cool and striking',
    description:
      'Your coloring is cool with high contrast, like a crisp winter night. Jewel tones and sharp neutrals make you striking, while dusty earth tones dull your natural drama.',
    tips: [
      { title: 'Own the jewel tones', text: 'Emerald, sapphire, fuchsia and true red were made for you.' },
      { title: 'High contrast works', text: 'Black and pure white — alone or together — sharpen your look.' },
      { title: 'Silver-tone finish', text: 'Silver and platinum jewellery match your cool undertone.' },
      { title: 'Skip the muddy shades', text: 'Avoid beige, mustard and washed-out earth tones near your face.' },
    ],
  },
}

export const UNDERTONE_CONTENT = {
  warm: {
    title: 'Warm',
    note: 'Your skin carries golden, peachy hues — gold jewellery and earth-toned colors harmonise with you naturally.',
  },
  cool: {
    title: 'Cool',
    note: 'Your skin carries pink and blue hues — silver jewellery, jewel tones and cool pastels suit you best.',
  },
  neutral: {
    title: 'Neutral',
    note: 'Your skin balances warm and cool — both gold and silver work, and you can wear an unusually wide color range.',
  },
}
