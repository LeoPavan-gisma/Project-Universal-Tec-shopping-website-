const sampleCatalog = [
    { name: 'Premium Ultrabook', category: 'laptop', price: 1299, use: 'work + travel' },
    { name: 'Gaming Laptop RTX', category: 'laptop', price: 1899, use: 'gaming' },
    { name: 'Smartphone Pro Max', category: 'phone', price: 999, use: 'flagship' },
    { name: 'Studio Headphones', category: 'audio', price: 349, use: 'monitoring' },
    { name: 'VR Headset System', category: 'vr', price: 399, use: 'immersive' },
    { name: 'Next-Gen Console', category: 'console', price: 499, use: 'gaming' },
    { name: '4K Monitor 27"', category: 'monitor', price: 459, use: 'creator' },
    { name: 'USB-C Docking Station', category: 'accessory', price: 129, use: 'desk' },
    { name: 'Mechanical RGB Keyboard', category: 'accessory', price: 149, use: 'typing' },
    { name: 'Wireless Gaming Mouse', category: 'accessory', price: 89, use: 'gaming' },
    { name: 'Portable Projector', category: 'projector', price: 349, use: 'travel' },
    { name: 'Smart Home Security Cam', category: 'smart-home', price: 199, use: 'security' },
    { name: 'Smart Speaker Home', category: 'smart-home', price: 129, use: 'assistant' },
    { name: 'Educational Robot Kit', category: 'robotics', price: 189, use: 'kids' },
    { name: 'Pro Robotics Arm Kit', category: 'robotics', price: 799, use: 'builders' },
    { name: 'Ergonomic Chair', category: 'chair', price: 299, use: 'comfort' },
]

const toEuro = (amount) => `€${amount.toFixed(0)}`

const pick = (options = []) => options[Math.floor(Math.random() * options.length)]

const randomPicks = (count = 2) => {
    const shuffled = [...sampleCatalog].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
}

const openers = [
    'Got it.',
    'On it.',
    'Sure thing.',
    'Absolutely.',
    'Happy to help.',
    'Let’s do it.',
]

const closers = [
    'Want me to tailor further?',
    'Need it faster or cheaper?',
    'Say the word if you want alternatives.',
    'I can refine by budget or brand.',
    'Tell me your priority and I’ll tighten it.',
]

const ctas = [
    'Share budget + use-case.',
    'Tell me if it’s for work, gaming, or school.',
    'Let me know your top priority: GPU, battery, or portability.',
    'Need accessories bundled in?',
]

const decorate = (core, context = {}) => {
    const hasCart = (context.cart || []).length > 0
    const lead = pick(openers)
    const tail = pick(closers)
    const ask = pick(ctas)

    if (hasCart && Math.random() > 0.6) {
        const cartNote = summarizeCart(context.cart)
        return `${lead} ${core} ${tail} ${cartNote}`
    }

    if (Math.random() > 0.5) return `${lead} ${core} ${tail}`
    if (Math.random() > 0.5) return `${lead} ${core} ${ask}`
    return `${lead} ${core}`
}

const formatList = (items) => items.map(i => `${i.name} (${toEuro(i.price)})`).join(', ')

const findWithinBudget = (budget) => sampleCatalog
    .filter(p => p.price <= budget)
    .sort((a, b) => a.price - b.price)

const pickByCategory = (category) => sampleCatalog
    .filter(p => p.category === category)
    .sort((a, b) => a.price - b.price)

const summarizeCart = (cart) => {
    if (!cart || !cart.length) return 'Your cart is empty. Add items and I will tailor suggestions to them.'
    const lines = cart.map(item => `${item.title || item.name} x${item.qty || 1} @ ${toEuro(item.price || 0)}`)
    const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 1), 0)
    return `You have ${cart.length} items: ${lines.join('; ')}. Estimated total: ${toEuro(total)}.`
}

export function generateJannuReply(message, context = {}) {
    const lower = message.toLowerCase()
    const budgetMatch = message.match(/€?\s*(\d{2,5})/)
    const budget = budgetMatch ? parseInt(budgetMatch[1], 10) : null
    const cart = context.cart || []

    const has = (words) => words.some(w => lower.includes(w))

    if (has(['track', 'tracking', 'order status', 'ord'])) {
        return pick([
            'Open Dashboard → Orders for live status. Drop an order ID and I will map you to support if needed.',
            'Tracking is in Dashboard → Orders. Paste your order ID if you want me to outline next steps.',
            'Dashboard → Orders shows real-time status. Share the order ID and I can draft escalation steps.'
        ])
    }

    if (has(['return', 'refund', 'exchange'])) {
        return pick([
            'Returns accepted within 30 days if unopened. Share order ID + item and I will outline the label steps.',
            'I can guide a return: need order ID and item name. Window is 30 days, unopened preferred.',
            'Refunds/returns: 30-day window. Send the order ID and item; I will draft the steps for you.'
        ])
    }

    if (has(['shipping', 'delivery'])) {
        return pick([
            'We ship EU/US with tracking: ~3-5 business days EU, 5-8 US. Express available at checkout.',
            'Tracked delivery across EU/US. Typical timing 3-5 days EU; 5-8 US. Express is an option.',
            'Shipping is tracked. EU ~3-5 days, US ~5-8. You can choose express during checkout.'
        ])
    }

    if (has(['payment', 'pay', 'card'])) {
        return pick([
            'Cards and PayPal are supported. If a payment hiccups, retry; test payments are set to succeed.',
            'We accept cards + PayPal. In test mode payments are forced to succeed, so you can proceed.',
            'Payments: card or PayPal. If something fails, re-open checkout—test mode approvals are enabled.'
        ])
    }

    if (has(['cart', 'basket'])) {
        return decorate(summarizeCart(cart), { cart })
    }

    if (has(['robot'])) {
        const robots = pickByCategory('robotics')
        return decorate(pick([
            `Robotics picks: ${formatList(robots)}. Educational Robot Kit suits kids; Pro Robotics Arm Kit is for builders.`,
            `For robots, try: ${formatList(robots)}. Want kid-friendly (Educational) or advanced (Pro Arm)?`,
            `I can suggest robots: ${formatList(robots)}. Tell me if it’s for learning or prototyping.`
        ]), { cart })
    }

    if (has(['console', 'ps5', 'xbox', 'switch'])) {
        const consolePick = sampleCatalog.find(p => p.category === 'console')
        return decorate(pick([
            `Console pick: ${consolePick ? `${consolePick.name} (${toEuro(consolePick.price)})` : 'Next-Gen Console'} with VR-ready support. Want a headset too?`,
            `Need a console? The Next-Gen Console is available (${consolePick ? toEuro(consolePick.price) : '€499'}). Want extra controllers or a VR headset?`,
            `For consoles, go Next-Gen Console (${consolePick ? toEuro(consolePick.price) : '€499'}). I can bundle it with a VR Headset if you like.`
        ]), { cart })
    }

    if (has(['drone'])) {
        const drone = sampleCatalog.find(p => p.name.toLowerCase().includes('drone'))
        return decorate(pick([
            `Drone suggestion: ${drone ? `${drone.name} at ${toEuro(drone.price)}` : 'Pro drone kit'}. Need 4K video or just aerial photos?`,
            `For drones, I suggest a 4K camera model. Budget? I can adjust accessories like extra batteries.`,
            `Looking at drones? Tell me if you need long flight time or 4K capture; I’ll pick a kit and spare battery.`
        ]), { cart })
    }

    if (has(['tablet', 'ipad', 'tab'])) {
        const tablet = sampleCatalog.find(p => p.category === 'tablet') || sampleCatalog.find(p => p.name.toLowerCase().includes('tablet'))
        return decorate(pick([
            `Tablet pick: ${tablet ? `${tablet.name} (${toEuro(tablet.price)})` : 'a 12.9" pro tablet'}. Need pencil/keyboard?`,
            `For tablets, go big screen if you sketch, smaller if you read. Want me to add a keyboard case?`,
            `I can size a tablet for you—tell me if it’s for media, drawing, or note-taking and your budget.`
        ]), { cart })
    }

    if (has(['camera', 'dslr'])) {
        const cam = sampleCatalog.find(p => p.name.toLowerCase().includes('camera'))
        return decorate(pick([
            `Camera pick: ${cam ? `${cam.name} (${toEuro(cam.price)})` : 'DSLR kit with lenses'}. Need 4K video or low-light priority?`,
            `For cameras, choose sensor + lens. Share budget and whether you need 4K/slow-mo; I’ll shortlist a kit.`,
            `I can spec a camera kit—tell me if it’s travel, studio, or vlogging and your price ceiling.`
        ]), { cart })
    }

    if (has(['chair', 'ergonomic', 'seat'])) {
        const chair = sampleCatalog.find(p => p.category === 'chair')
        return decorate(pick([
            `Comfort pick: ${chair ? `${chair.name} at ${toEuro(chair.price)}` : 'ergonomic chair with lumbar support'}. Want headrest or mesh?`,
            `For chairs, decide on mesh vs cushioned and headrest. I can point you to a lumbar-friendly option.`,
            `Looking for a chair? I’ll choose lumbar + height adjustable. Any preference for headrest or arm style?`
        ]), { cart })
    }

    if (has(['storage', 'ssd', 'drive'])) {
        const ssd = sampleCatalog.find(p => p.category === 'storage' || p.name.toLowerCase().includes('ssd'))
        return decorate(pick([
            `Storage pick: ${ssd ? `${ssd.name} (${toEuro(ssd.price)})` : 'portable SSD 1TB around €159'}. Need rugged or slim?`,
            `For SSDs, choose capacity + speed. Want a 1TB portable or a dock-friendly NVMe enclosure?`,
            `I can size storage: tell me capacity (512GB/1TB/2TB) and whether you need rugged or ultra-slim.`
        ]), { cart })
    }

    if (has(['dock', 'docking', 'usb-c'])) {
        const dock = sampleCatalog.find(p => p.category === 'accessory' && p.name.toLowerCase().includes('dock'))
        return decorate(pick([
            `Dock pick: ${dock ? `${dock.name} (${toEuro(dock.price)})` : 'USB-C dock'} for single-cable desk. Need dual 4K?`,
            `USB-C dock suggestion: dual display + power passthrough. Do you need Ethernet and SD reader?`,
            `For docking, I’ll pick one with PD + HDMI. How many monitors and what laptop are you on?`
        ]), { cart })
    }

    if (has(['laptop', 'notebook'])) {
        const picks = pickByCategory('laptop')
        return decorate(pick([
            `Top laptops: ${formatList(picks)}. Ultrabook for work/travel; Gaming Laptop RTX for high-FPS + AI workloads.`,
            `Two good options: ${formatList(picks)}. Need portability (Ultrabook) or GPU power (Gaming RTX)?`,
            `Laptop shortlist: ${formatList(picks)}. Share use-case (coding, gaming, creator) and budget for a tighter pick.`
        ]), { cart })
    }

    if (has(['monitor', 'display', 'screen'])) {
        const monitors = pickByCategory('monitor')
        return decorate(pick([
            `Monitor rec: ${formatList(monitors)}. 27" 4K pairs well with MacBook; add Docking Station for single-cable setup.`,
            `Displays: ${formatList(monitors)}. 27" 4K is color-accurate; want gaming (high refresh) or creator (4K)?`,
            `Monitors I like: ${formatList(monitors)}. For MacBooks, go 4K + USB-C dock for one-cable desks.`
        ]), { cart })
    }

    if (has(['bundle', 'build', 'setup'])) {
        const base = ['Premium Ultrabook', '4K Monitor 27"', 'USB-C Docking Station', 'Mechanical RGB Keyboard']
        const bundle = sampleCatalog.filter(p => base.includes(p.name))
        const total = bundle.reduce((sum, p) => sum + p.price, 0)
        return decorate(pick([
            `Starter workspace bundle: ${formatList(bundle)}. About ${toEuro(total)}. For gaming, swap Ultrabook → Gaming Laptop RTX.`,
            `Desk build: ${formatList(bundle)} ≈ ${toEuro(total)}. Prefer minimal? Drop the RGB keyboard and keep the dock + 4K display.`,
            `Balanced setup: ${formatList(bundle)} (~${toEuro(total)}). Tell me if you need it tuned for gaming or video editing.`
        ]), { cart })
    }

    if (budget) {
        const fits = findWithinBudget(budget)
        if (fits.length) {
            const best = fits.slice(-3) // top near budget
            return decorate(pick([
                `Within ${toEuro(budget)} you can grab: ${formatList(best)}. Need this for gaming, coding, or creators?`,
                `Budget ${toEuro(budget)}: consider ${formatList(best)}. Share the main use and I’ll refine it.`,
                `I can fit ${formatList(best)} under ${toEuro(budget)}. Want me to bias for battery life or GPU?`
            ]), { cart })
        }
        return `No matches under ${toEuro(budget)} in my sample list, but I can still suggest refurbished or accessory bundles.`
    }

    if (has(['recommend', 'suggest', 'idea', 'option'])) {
        const picks = randomPicks(3)
        return decorate(pick([
            `Here are three ideas: ${formatList(picks)}. Want me to tailor by use-case?`,
            `Try these: ${formatList(picks)}. Share your priority (GPU, battery, portability) to tighten the list.`,
            `${formatList(picks)} could fit. Tell me your budget and whether you need them for work, gaming, or school.`
        ]), { cart })
    }

    if (has(['deal', 'discount', 'offer'])) {
        return decorate(pick([
            'Current focus: curated picks. I can still optimize price—share budget and I’ll keep it lean.',
            'No live promos in this mock mode, but I can pick the best price/performance items for your budget.',
            'Deals are simulated here; tell me budget and I’ll recommend highest value items instead.'
        ]), { cart })
    }

    if (has(['headphone', 'audio'])) {
        return decorate(pick([
            'Studio Headphones (€349) are flat/neutral for editing; add Smart Speaker Home (€129) for room audio.',
            'For audio: Studio Headphones (€349) for neutral monitoring; Smart Speaker Home (€129) for casual listening.',
            'Need audio? Studio Headphones are neutral for editing. If you want room sound, pair with Smart Speaker Home.'
        ]), { cart })
    }

    if (has(['vr'])) {
        return decorate(pick([
            'VR Headset System (€399) is in stock. Pair with Next-Gen Console (€499) or a gaming PC for best tracking.',
            'VR pick: Headset System (€399). For best tracking, hook to a gaming PC or the latest console.',
            'Grab the VR Headset (€399). Want a PC build or console pairing to go with it?'
        ]), { cart })
    }

    // Default helpful nudge
    return decorate(pick([
        'Tell me your goal (gaming, work, creator) and budget. I will list 2-3 specific items with prices.',
        'What are you optimizing for—battery, GPU, or portability—and what’s the budget? I’ll shortlist 2-3 items.',
        'Share your budget and main use-case. I’ll craft a small set of options with prices in euros.'
    ]), { cart })
}
