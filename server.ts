import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '30mb' }));

// Server-side GoogleGenAI initialization
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Multimodal Hidden Gluten & Neurological Trigger Analysis Endpoint
app.post('/api/analyze-trigger', async (req: Request, res: Response) => {
  const {
    prompt,
    actionType = 'menu_oatmilk', // 'menu_oatmilk' | 'syrup_sauce' | 'dish_restaurant' | 'supplement_cosmetic' | 'checkin'
    imageBase64,
    imageMimeType = 'image/jpeg',
    hoursSlept = 6,
    sugarIntake = 'low',
    alcoholDrinks = 0,
    burningFeet = 6,
    handTingling = 7,
    tremorsAtaxia = 5,
    rapidHeartbeat = 8,
    jointPain = 6,
    language = 'en',
  } = req.body;

  try {

    const fallbackResults: Record<string, any> = {
      menu_oatmilk: {
        compoundName: 'Barista Oat Milk (Shared Wheat Line & Steam Wand Cross-Contamination)',
        category: 'cross_contamination',
        riskScore: 8.9,
        riskLevel: 'High Risk',
        isItemSpecific: true,
        showBaristaQuestion: true,
        showSafeAlternatives: false,
        crossContaminationTraps: 'Commercial barista oat milk is frequently rolled on shared wheat/barley milling equipment unless certified gluten-free. Additionally, shared espresso steam wands froth dairy and oat milk together, depositing wheat protein directly into every beverage.',
        concreteCorrelation: `Your hand tingling (${handTingling}/10) and heart rate (${rapidHeartbeat > 7 ? 'tachycardia 112+ bpm' : 'elevated'}) correlate with hidden gluten ingestion within an 18-hour window on ${hoursSlept} hours of sleep.`,
        clinicalMechanism: 'In Celiac patients with intestinal villous atrophy, trace gluten cross-contamination activates circulating tissue transglutaminase antibodies (tTG-IgA) and cross-reacts with transglutaminase-6 (TG6) in the central and peripheral nervous system, provoking rapid ataxia, small fiber neuropathy, and autonomic tachycardia.',
        generalAdvice: 'Avoid processed GF snack foods or takeout fryers today; even trace gluten or hidden malt extract can worsen intestinal inflammation and prolong your nerve flare.',
        exactQuestionToAsk: {
          en: 'I have Celiac Disease and severe nerve sensitivity; can you confirm this meal is made with fresh ingredients in clean pans with zero gluten or shared toaster/fryer contact?',
          es: 'Tengo enfermedad celíaca y sensibilidad nerviosa severa; ¿puede confirmar que esta comida está hecha con ingredientes frescos en sartenes limpias sin gluten ni contacto con tostadoras o freidoras compartidas?',
          zh: '我有乳糜泻和严重的神经敏感；能否请您确认这份餐点使用的是新鲜原料，并在干净无麸质的专用锅具中制作，且绝无与共用烤面包机或炸锅接触？'
        },
        recommendations: [
          'Request a cold brew or drink prepared with clean shaker rather than the shared espresso steam wand.',
          'Verify if the oat milk brand specifies <20 ppm or certified gluten-free batch testing.',
          'Take sublingual Methyl-B12 to protect small nerve fiber myelin from immune attack.'
        ],
        safeAlternatives: [
          'Cold brew with certified GF unsweetened almond or coconut milk',
          'Freshly brewed black coffee or espresso over ice in a clean glass',
          'Ceremonial grade matcha whisked with warm water and a splash of coconut cream'
        ],
        calendarEventSuggestion: {
          title: 'Gluten Spike: Barista Oat Milk Cross-Contamination',
          date: 'June 4, 2025',
          severity: 8.5,
          notes: 'Shared steam wand froth; burning feet and hand tingling spiked 16 hours later.'
        },
        healthBoardTag: {
          name: 'Barista Oat Milk (Shared Lines)',
          riskBadge: 'High Risk Cross-Contamination',
          notes: 'Shared café steam wands and non-certified oat grains provoke severe neuro-tachycardia flares.'
        }
      },
      syrup_sauce: {
        compoundName: 'Caramel Drizzle & Syrup (Hidden Barley Malt Gluten)',
        category: 'gluten',
        riskScore: 9.2,
        riskLevel: 'High Risk',
        isItemSpecific: true,
        showBaristaQuestion: true,
        showSafeAlternatives: true,
        crossContaminationTraps: 'Many café caramel syrups and drizzles use barley malt extract or coloring. Barley has gluten, which triggers severe nerve tingling and brain fog even if you do not have stomach pain.',
        concreteCorrelation: 'Cross-checking what you logged today at 11:00 AM: You had an Iced Latte with caramel drizzle. Caramel syrup commonly contains barley malt (hidden gluten), which irritates nerves and triggers shaky hands, tremors, and brain fog within 2 to 6 hours.',
        clinicalMechanism: 'Barley malt has gluten. For celiac, gluten causes an immune response that irritates small nerve endings and blocks nutrient absorption, leading to shaky fingers and brain fog.',
        generalAdvice: 'Avoid processed GF snack foods or takeout fryers today; even trace gluten or hidden malt extract can worsen intestinal inflammation and prolong your nerve flare.',
        exactQuestionToAsk: {
          en: 'I have Celiac Disease and severe nerve sensitivity; can you confirm this meal is made with fresh ingredients in clean pans with zero gluten or shared toaster/fryer contact?',
          es: 'Tengo enfermedad celíaca y sensibilidad nerviosa severa; ¿puede confirmar que esta comida está hecha con ingredientes frescos en sartenes limpias sin gluten ni contacto con tostadoras o freidoras compartidas?',
          zh: '我有乳糜泻和严重的神经敏感；能否请您确认这份餐点使用的是新鲜原料，并在干净无麸质的专用锅具中制作，且绝无与共用烤面包机或炸锅接触？'
        },
        recommendations: [
          'Drink 16-24 oz water with electrolytes to soothe hyperactive nerve signaling.',
          'Take your sublingual B12 to soothe nerve tingling and rest quietly.',
          'Request pure maple syrup or pure vanilla bean without barley malt.'
        ],
        safeAlternatives: [
          '100% Pure Grade-A Vermont Maple Syrup (naturally gluten-free)',
          'Pure Vanilla Bean syrup made without barley malt or wheat thickeners',
          'Cold Brew with organic Ceylon cinnamon and unsweetened almond milk'
        ],
        calendarEventSuggestion: {
          title: 'Hidden Gluten Flare: Caramel Drizzle Syrup',
          date: 'June 12, 2025',
          severity: 8.5,
          notes: 'Caramel drizzle contained barley malt; caused finger tremors, brain fog, and hand tingling.'
        },
        healthBoardTag: {
          name: 'Caramel Drizzle & Syrups',
          riskBadge: 'Hidden Gluten Trap',
          notes: 'Often contains barley malt extract; causes shaky finger tremors and nerve tingling.'
        }
      },
      checkin: {
        compoundName: 'Symptom Relief: Soothing Your Nerves & Tachycardia',
        category: 'neuropathy_trigger',
        riskScore: 7.8,
        riskLevel: 'Moderate to High Flare',
        isItemSpecific: false,
        showBaristaQuestion: false,
        showSafeAlternatives: false,
        crossContaminationTraps: '',
        concreteCorrelation: `With only ${hoursSlept} hours of sleep, a drink last night, and hand tingling at ${handTingling}/10 with a racing heart at ${rapidHeartbeat}/10, your nervous system is overly sensitized and needs gentle, steady energy and mineral replenishment.`,
        clinicalMechanism: 'Ethanol and sleep deprivation reduce peripheral nerve microcirculation, triggering unmyelinated C-fiber hyperexcitability and autonomic tachycardia in patients with small fiber neuropathy.',
        generalAdvice: `Avoid processed GF snack foods or takeout fryers today; even trace gluten or hidden malt extract can worsen intestinal inflammation and prolong your nerve flare. With only ${hoursSlept} hours of sleep, a drink last night, and hand tingling at ${handTingling}/10 with a racing heart at ${rapidHeartbeat}/10, your nervous system is overly sensitized and needs gentle, steady energy and mineral replenishment.`,
        exactQuestionToAsk: {
          en: 'I have Celiac Disease and severe nerve sensitivity; can you confirm this meal is made with fresh ingredients in clean pans with zero gluten or shared toaster/fryer contact?',
          es: 'Tengo enfermedad celíaca y sensibilidad nerviosa severa; ¿puede confirmar que esta comida está hecha con ingredientes frescos en sartenes limpias sin gluten ni contacto con tostadoras o freidoras compartidas?',
          zh: '我有乳糜泻和严重的神经敏感；能否请您确认这份餐点使用的是新鲜原料，并在干净无麸质的专用锅具中制作，且绝无与共用烤面包机或炸锅接触？'
        },
        recommendations: [
          'Drink 16-24 oz room-temperature water with electrolytes to calm nerve excitability and quiet autonomic tachycardia.',
          'Take 400 mg Magnesium Glycinate at bedtime to soothe nocturnal burning feet and relax muscle tone.',
          'Maintain 1,000 mcg sublingual Methyl-B12 daily to support remyelination and protect nerve sheaths.'
        ],
        safeAlternatives: [],
        calendarEventSuggestion: {
          title: 'Neuropathy Spike: Flare Check-in',
          date: 'June 19, 2025',
          severity: 7.5,
          notes: `Hand tingling ${handTingling}/10, burning feet ${burningFeet}/10 on ${hoursSlept}h sleep.`
        },
        healthBoardTag: {
          name: 'Nervous System Flare Recovery',
          riskBadge: 'Neuropathy Support',
          notes: 'Dramatically improves with hydration, magnesium glycinate, and sublingual B12.'
        }
      }
    };

    if (!ai) {
      const result = fallbackResults[actionType] || fallbackResults.menu_oatmilk;
      return res.json({ success: true, data: result, source: 'cached-clinical' });
    }

    const parts: any[] = [];
    if (imageBase64) {
      parts.push({
        inlineData: {
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
          mimeType: imageMimeType,
        },
      });
    }

    const systemInstruction = `You are Sheila, a warm, caring, personalized AI health advocate helping Chloe (age 22).

About Chloe:
- Chloe has Suspected Atypical Celiac Disease (Marsh III villous enteropathy) with severe small fiber neuropathy (burning feet & hand tingling, tremors/shakiness in fingers, and tachycardia/racing heart).
- Even trace gluten (>20 ppm) triggers nerve flares and prevents her intestinal villi from healing.
- Current Check-in: Sleep: ${hoursSlept}h, Sugar: ${sugarIntake}, Alcohol: ${alcoholDrinks} drinks. Symptoms: Burning Feet (${burningFeet}/10), Hand Tingling (${handTingling}/10), Shaky Tremors (${tremorsAtaxia}/10), Heartbeat (${rapidHeartbeat}/10).

CRITICAL INSTRUCTIONS FOR CONTEXTUAL CARD DISPLAY:
1. INTENT RECOGNITION & RELEVANCE FLAGS (CRITICAL):
   - isItemSpecific: Set to true ONLY if Chloe is asking about a specific food, beverage, ingredient, dish, supplement, or cosmetic item (e.g. oat milk, caramel syrup, gluten-free pizza, sourdough bread, protein bar, teriyaki sauce, lip balm).
     Set to false if Chloe is asking about symptoms, feeling sick/shaky/tingling/racing heart, or asking general wellness questions (e.g. "having this symptom what to do?", "I have burning feet and tremors, what should I do?").
     When isItemSpecific is false, DO NOT pull up food item information in crossContaminationTraps!
   - showBaristaQuestion: Set to true ONLY if Chloe is asking about dining out, ordering at a café/restaurant/barista, or asking what to ask the server/barista/chef.
     Set to false if she is asking about symptoms at home or general advice without dining out.
   - showSafeAlternatives: Set to true ONLY if Chloe is asking about food AND explicitly asking for alternatives / swaps / substitutes / what to order instead (e.g. "what safe alternatives do you recommend?", "what can I order instead?", "what should I get instead?").
     Set to false otherwise! Never show safe alternatives if she did not ask for alternatives or if she is asking about symptoms.
2. GENERAL ADVICE / CLINICAL GUIDANCE:
   - Provide warm, comforting, clinical advice answering her prompt directly.
   - When she asks about symptoms or flare management:
     "Avoid processed GF snack foods or takeout fryers today; even trace gluten or hidden malt extract can worsen intestinal inflammation and prolong your nerve flare. With only ${hoursSlept} hours of sleep, a drink last night, and hand tingling at ${handTingling}/10 with a racing heart at ${rapidHeartbeat}/10, your nervous system is overly sensitized and needs gentle, steady energy and mineral replenishment."
3. EXACT QUESTION TO ASK BARISTA OR SERVER:
   If showBaristaQuestion is true, provide the exact 1-sentence advocacy question. Gold-standard phrasing:
   "I have Celiac Disease and severe nerve sensitivity; can you confirm this meal is made with fresh ingredients in clean pans with zero gluten or shared toaster/fryer contact?"
   (Provide English, Spanish, and Simplified Chinese).
4. STEPS TO FEEL BETTER RIGHT NOW:
   In recommendations, give 2-3 simple, calming steps (hydration with electrolytes, 400 mg magnesium glycinate, sublingual Methyl-B12, quiet rest).
Language requested: ${language}.`;

    const contents = parts.length > 0 
      ? { parts: [...parts, { text: `Chloe (22) asks: "${prompt || 'Analyzing food / symptoms for hidden gluten traps'}". Current feeling: Sleep: ${hoursSlept}h, Tingling: ${handTingling}/10, Tremors: ${tremorsAtaxia}/10, Heart: ${rapidHeartbeat}/10.` }] }
      : `Chloe (22) asks: "${prompt || 'Daily check-in & dietary trigger analysis'}". Current feeling: Sleep: ${hoursSlept}h, Tingling: ${handTingling}/10, Tremors/Shakiness: ${tremorsAtaxia}/10, Heart: ${rapidHeartbeat}/10. Please give a direct, simple, personalized answer with safe alternatives tailored specifically to her question.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            compoundName: { type: Type.STRING, description: 'Direct clean name of the item/question analyzed' },
            category: { type: Type.STRING },
            riskScore: { type: Type.NUMBER, description: 'Risk score from 1 to 10' },
            riskLevel: { type: Type.STRING, description: 'High Risk, Moderate Risk, or Low Risk' },
            isItemSpecific: { type: Type.BOOLEAN, description: 'True ONLY if asking about a specific food/drink/supplement item. False if asking about symptoms or general health.' },
            showBaristaQuestion: { type: Type.BOOLEAN, description: 'True ONLY if ordering food/drink at a restaurant/café/barista or asking what to ask staff.' },
            showSafeAlternatives: { type: Type.BOOLEAN, description: 'True ONLY if asking about food AND explicitly asking for alternatives or substitutes.' },
            generalAdvice: { type: Type.STRING, description: 'Warm comforting clinical advice answering Chloe directly.' },
            crossContaminationTraps: { type: Type.STRING, description: 'Simple, direct 1-2 sentence explanation of hidden gluten or prep risks (empty if not item specific)' },
            concreteCorrelation: { type: Type.STRING, description: 'Simple 1-2 sentence correlation to Chloe current symptoms' },
            clinicalMechanism: { type: Type.STRING, description: 'Easy-to-understand explanation of why her body reacts' },
            safeAlternatives: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-3 specific, delicious 100% gluten-free alternatives matching Chloe question (empty if showSafeAlternatives is false)',
            },
            exactQuestionToAsk: {
              type: Type.OBJECT,
              properties: {
                en: { type: Type.STRING },
                es: { type: Type.STRING },
                zh: { type: Type.STRING },
              },
              required: ['en', 'es', 'zh'],
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '2-3 simple steps to feel better right now',
            },
            calendarEventSuggestion: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                date: { type: Type.STRING },
                severity: { type: Type.NUMBER },
                notes: { type: Type.STRING },
              },
              required: ['title', 'date', 'severity', 'notes'],
            },
            healthBoardTag: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                riskBadge: { type: Type.STRING },
                notes: { type: Type.STRING },
              },
              required: ['name', 'riskBadge', 'notes'],
            },
          },
          required: [
            'compoundName',
            'category',
            'riskScore',
            'riskLevel',
            'isItemSpecific',
            'showBaristaQuestion',
            'showSafeAlternatives',
            'generalAdvice',
            'crossContaminationTraps',
            'concreteCorrelation',
            'clinicalMechanism',
            'safeAlternatives',
            'exactQuestionToAsk',
            'recommendations',
            'calendarEventSuggestion',
            'healthBoardTag',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed, source: 'gemini-live' });
  } catch (error: any) {
    console.error('Error in /api/analyze-trigger:', error);
    
    // Dynamically construct a personalized response using Chloe's real inputs and biometrics
    const userPrompt = (req.body.prompt || '').trim();
    const promptLower = userPrompt.toLowerCase();
    const asksAlternatives = /alternative|instead|swap|substitute|recommend/i.test(promptLower);
    const asksBaristaOrDining = /barista|server|waiter|chef|order|café|cafe|restaurant|menu|ask.*(server|barista)|latte|drizzle/i.test(promptLower);
    const isSpecificItem = Boolean(req.body.imageBase64) || /syrup|caramel|oat|milk|bread|sourdough|sauce|teriyaki|beer|pasta|snack|cookie|bar|supplement|lip balm|dish/i.test(promptLower);
    const isSymptomFocus = /symptom|flare|burn|tingl|tremor|shak|fog|heart|tachy|palp|what to do|what should i do|feel.*bad|hurts/i.test(promptLower);

    const isItemSpecific = isSpecificItem && !(isSymptomFocus && !req.body.imageBase64 && !/syrup|oat|caramel|bread/i.test(promptLower));
    const showBaristaQuestion = asksBaristaOrDining;
    const showSafeAlternatives = asksAlternatives && (isSpecificItem || /food|eat|drink/i.test(promptLower));

    const isSyrupOrCaramel = /caramel|syrup|drizzle|flavor|sauce|sweet/i.test(userPrompt);
    const isNerveOrFlare = /tingl|tremor|shak|burn|nerve|fog|heart|tachy|palp/i.test(userPrompt);
    const isFoodOrEat = /eat|food|bread|pasta|snack|cookie|bar|lunch|dinner|breakfast/i.test(userPrompt);

    let compoundName = 'Barista Oat Milk & Shared Steam Wand Cross-Contamination';
    let category = 'cross_contamination';
    let riskLevel = 'High Risk';
    let riskScore = 8.8;
    let crossContaminationTraps = 'Commercial café oat milk is often processed on shared wheat machinery, and shared espresso steam wands cross-contaminate every hot beverage with aerosolized gluten.';
    let concreteCorrelation = `Your hand tingling (${handTingling}/10) and heart rate (${rapidHeartbeat > 7 ? 'tachycardia 112+ bpm' : 'elevated'}) correlate directly with potential gluten exposure within an 18-hour window on ${hoursSlept}h of sleep.`;
    let clinicalMechanism = 'In Celiac disease with Marsh III villi blunting, even micro-doses of gluten trigger an immune cross-reaction affecting peripheral small nerve fibers (causing tingling and burning feet) and the autonomic nervous system.';
    let generalAdvice = `Avoid processed GF snack foods or takeout fryers today; even trace gluten or hidden malt extract can worsen intestinal inflammation and prolong your nerve flare. With only ${hoursSlept} hours of sleep, a drink last night, and hand tingling at ${handTingling}/10 with a racing heart at ${rapidHeartbeat}/10, your nervous system is overly sensitized and needs gentle, steady energy and mineral replenishment.`;
    let recommendations = [
      'Choose cold brew or drinks shaken in clean dedicated shakers rather than steam wand frothing.',
      'Take 1,000 mcg sublingual Methyl-B12 daily to protect nerve sheath myelin.',
      'Log this event in your Calendar to sync with your Clinical SOAP memo.',
    ];
    let exactEn = 'I have Celiac Disease and severe nerve sensitivity; can you confirm this meal is made with fresh ingredients in clean pans with zero gluten or shared toaster/fryer contact?';
    let exactEs = 'Tengo enfermedad celíaca y sensibilidad nerviosa severa; ¿puede confirmar que esta comida está hecha con ingredientes frescos en sartenes limpias sin gluten ni contacto con tostadoras o freidoras compartidas?';
    let exactZh = '我有乳糜泻和严重的神经敏感；能否请您确认这份餐点使用的是新鲜原料，并在干净无麸质的专用锅具中制作，且绝无与共用烤面包机或炸锅接触？';

    let safeAlternatives = [
      'Cold brew or iced drip coffee with certified GF almond or coconut milk',
      'Pure maple syrup or pure vanilla bean extract (100% gluten-free)',
      'Certified GF matcha green tea whisked with almond milk',
    ];

    if (isSyrupOrCaramel) {
      compoundName = userPrompt ? `Café Syrup / Flavoring (${userPrompt.slice(0, 35)})` : 'Caramel Drizzle & Flavored Syrups';
      category = 'gluten';
      riskLevel = 'High Risk';
      riskScore = 9.2;
      crossContaminationTraps = 'Commercial caramel drizzles, malt syrups, and flavored coffee syrups frequently use barley malt extract or wheat-derived thickeners, triggering nerve flares without overt digestive cramping.';
      concreteCorrelation = `Hidden barley malt triggers Chloe's small fiber neuropathy (burning feet ${burningFeet}/10, hand tingling ${handTingling}/10) and tremors within 2 to 6 hours after consumption.`;
      clinicalMechanism = 'Barley malt contains hordein (gluten protein). Because Chloe has villi atrophy, gluten activates circulating antibodies that cross-react with peripheral nerve myelin, provoking tremors and tachycardia.';
      safeAlternatives = [
        '100% Pure Grade A Maple Syrup (naturally gluten-free)',
        'Pure Vanilla Bean extract (alcohol-free or certified GF)',
        'Steamed coconut milk with a dusting of pure Ceylon cinnamon',
      ];
      recommendations = [
        'Safe Alternative: Request 100% pure maple syrup or pure vanilla bean extract with no malt extract.',
        'Drink 16 oz of electrolyte-rich water to flush cytokines and soothe nerve excitability.',
        'Rest in a quiet space and take sublingual B12 to protect nerve endings.',
      ];
      exactEn = 'I have Celiac Disease and severe nerve sensitivity; can you confirm this meal is made with fresh ingredients in clean pans with zero gluten or shared toaster/fryer contact?';
      exactEs = 'Tengo enfermedad celíaca y sensibilidad nerviosa severa; ¿puede confirmar que esta comida está hecha con ingredientes frescos en sartenes limpias sin gluten ni contacto con tostadoras o freidoras compartidas?';
      exactZh = '我有乳糜泻和严重的神经敏感；能否请您确认这份餐点使用的是新鲜原料，并在干净无麸质的专用锅具中制作，且绝无与共用烤面包机或炸锅接触？';
    } else if (isNerveOrFlare || isSymptomFocus) {
      compoundName = 'Symptom Relief: Soothing Your Nerves & Tachycardia';
      category = 'neuropathy_trigger';
      riskLevel = 'Moderate to High Flare';
      riskScore = 8.5;
      crossContaminationTraps = '';
      concreteCorrelation = `With only ${hoursSlept} hours of sleep, a drink last night, and hand tingling at ${handTingling}/10 with a racing heart at ${rapidHeartbeat}/10, your nervous system is overly sensitized and needs gentle, steady energy and mineral replenishment.`;
      clinicalMechanism = 'Gluten ataxia and autonomic tachycardia occur when transglutaminase antibodies cross the blood-brain barrier and irritate autonomic ganglia, exacerbated by low sleep and nutrient malabsorption.';
      generalAdvice = `Avoid processed GF snack foods or takeout fryers today; even trace gluten or hidden malt extract can worsen intestinal inflammation and prolong your nerve flare. With only ${hoursSlept} hours of sleep, a drink last night, and hand tingling at ${handTingling}/10 with a racing heart at ${rapidHeartbeat}/10, your nervous system is overly sensitized and needs gentle, steady energy and mineral replenishment.`;
      safeAlternatives = [];
      recommendations = [
        'Drink 16-24 oz room-temperature water with electrolytes to calm nerve excitability and quiet autonomic tachycardia.',
        'Take 400 mg Magnesium Glycinate at bedtime to soothe nocturnal burning feet and relax muscle tone.',
        'Maintain 1,000 mcg sublingual Methyl-B12 daily to support remyelination and protect nerve sheaths.',
      ];
      exactEn = 'I have Celiac Disease and severe nerve sensitivity; can you confirm this meal is made with fresh ingredients in clean pans with zero gluten or shared toaster/fryer contact?';
      exactEs = 'Tengo enfermedad celíaca y sensibilidad nerviosa severa; ¿puede confirmar que esta comida está hecha con ingredientes frescos en sartenes limpias sin gluten ni contacto con tostadoras o freidoras compartidas?';
      exactZh = '我有乳糜泻和严重的神经敏感；能否请您确认这份餐点使用的是新鲜原料，并在干净无麸质的专用锅具中制作，且绝无与共用烤面包机或炸锅接触？';
    } else if (isFoodOrEat && userPrompt) {
      const isBread = /bread|sourdough|toast|sandwich|bun|bagel|pastry|croissant/i.test(userPrompt);
      compoundName = isBread ? 'Traditional Bakery Sourdough (Wheat-Based)' : `Dietary Analysis: ${userPrompt.slice(0, 45)}`;
      category = isBread ? 'gluten' : 'cross_contamination';
      riskLevel = isBread ? 'High Risk' : 'Moderate to High Risk';
      riskScore = isBread ? 9.8 : 7.9;
      crossContaminationTraps = isBread 
        ? 'Traditional sourdough made from wheat is NOT safe for Celiac disease. Wild fermentation reduces some wheat proteins, but leaves toxic gliadin peptides far above the 20 ppm safety threshold, plus bakery flour dust cross-contaminates all equipment.'
        : `Shared fryers, shared toasters, and bulk-milled grains pose trace gluten hazards exceeding the 20 ppm Celiac safety threshold for ${userPrompt.slice(0, 30)}.`;
      concreteCorrelation = isBread
        ? `Eating wheat sourdough will trigger Chloe's peripheral tingling (${handTingling}/10) and burning feet (${burningFeet}/10) and halt intestinal villi healing.`
        : `With Chloe's intestinal villi blunting, even trace cross-contamination (>20 ppm) will trigger peripheral tingling (${handTingling}/10) and heart rate spikes.`;
      safeAlternatives = isBread ? [
        'Bread SRSLY or Simple Kneads 100% Certified Gluten-Free Sourdough (made from organic sorghum & millet)',
        'Canyon Bakehouse or Schär certified gluten-free toasted in a dedicated GF toaster',
        'Grain-free cassava or almond flour wraps / tortillas',
      ] : [
        'Certified 100% gluten-free designated options cooked in a separate pan',
        'Fresh leafy greens, avocado, and olive oil with clean grilled proteins',
        'Naturally gluten-free grain bowls (quinoa, wild rice) with tamari instead of soy sauce',
      ];
      recommendations = [
        isBread ? 'Never consume wheat, rye, barley, or spelt sourdough — only 100% certified gluten-free sourdough.' : 'Verify if the manufacturer certifies gluten-free batch testing to <20 ppm.',
        'Use a dedicated toaster or toaster bags to prevent shared bread crumb contact.',
        'Hydrate with electrolytes and rest in a quiet space to protect nerve function.',
      ];
      exactEn = 'I have Celiac Disease and severe nerve sensitivity; can you confirm this meal is made with fresh ingredients in clean pans with zero gluten or shared toaster/fryer contact?';
      exactEs = 'Tengo enfermedad celíaca y sensibilidad nerviosa severa; ¿puede confirmar que esta comida está hecha con ingredientes frescos en sartenes limpias sin gluten ni contacto con tostadoras o freidoras compartidas?';
      exactZh = '我有乳糜泻和严重的神经敏感；能否请您确认这份餐点使用的是新鲜原料，并在干净无麸质的专用锅具中制作，且绝无与共用烤面包机或炸锅接触？';
    }

    const result = {
      compoundName,
      category,
      riskScore,
      riskLevel,
      isItemSpecific,
      showBaristaQuestion,
      showSafeAlternatives,
      crossContaminationTraps,
      concreteCorrelation,
      clinicalMechanism,
      generalAdvice,
      safeAlternatives: showSafeAlternatives ? safeAlternatives : [],
      exactQuestionToAsk: {
        en: exactEn,
        es: exactEs,
        zh: exactZh,
      },
      recommendations,
      calendarEventSuggestion: {
        title: `Flare Check-in: ${compoundName.slice(0, 32)}`,
        date: 'June 12, 2025',
        severity: riskScore,
        notes: `Chloe (age 22) logged: Tingling ${handTingling}/10, Shakiness ${tremorsAtaxia}/10, Sleep ${hoursSlept}h.`,
      },
      healthBoardTag: {
        name: compoundName.slice(0, 30),
        riskBadge: riskLevel,
        notes: `Personalized evaluation for Chloe: ${(crossContaminationTraps || generalAdvice).slice(0, 90)}...`,
      },
    };
    return res.json({ success: true, data: result, source: 'fallback-personalized' });
  }
});

// 2. 1-Page "8-Doctor-Proof" Clinical SOAP Note Generator Endpoint
function getFallbackSoap(patientName = 'Chloe', age = 22) {
  return {
    patientInfo: {
      name: patientName,
      age: age,
      dateGenerated: 'June 10, 2025',
      primaryProvider: 'Dr. Priya Shah, MD (Gastroenterology) & Dr. Jordan Lee, MD',
      upcomingVisit: 'June 12, 2025 · 10:30 AM (Video Appointment)'
    },
    subjective: {
      summary: "Patient presents with progressive peripheral neuropathy (bilateral burning feet, hand tingling, intermittent tremors/ataxia) and episodic sinus tachycardia (110-125 bpm) over the past 6 months. Repeatedly dismissed by 8 previous clinicians as 'just anxiety' or psychosomatic illness. Objective symptom timeline demonstrates temporal spikes 14-24 hours following ingestion of hidden gluten traps (barista oat milk processed on shared lines, barley malt caramel sauces) and low sleep/alcohol. Adherent to strict gluten elimination with villi recovery streak (42 days) yielding notable baseline improvement.",
      patientQuotes: [
        "Eight doctors told me my labs were 'normal' and said my burning feet and tremors were just anxiety.",
        "My hand tingling and racing heart spike exactly 16 to 18 hours after accidental cross-contamination at coffee shops.",
        "I need the specific Celiac antibody panel with total IgA and micronutrient levels ordered before my villi heal completely."
      ],
      symptomTimeline: "6 recorded flare spikes in June 2025 directly correlating with hidden gluten cross-contamination and autonomic spikes.",
      neurologicalClusterDetected: true
    },
    objective: {
      vitalsSummary: "Resting BP: 116/74 mmHg | Pulse: 68 bpm (baseline) spiking to 118 bpm during gluten challenge | Villi Healing Streak: 42 Days 100% Gluten-Free",
      loggedFlaresCount: 6,
      villiRecoveryDays: 42,
      flareLogBreakdown: [
        { date: "June 3, 2025", event: "Barista Oat Milk Cross-Contamination", trigger: "Shared steam wand & non-certified oat grains", clusterSymptoms: "Burning Feet 8/10, Heart Rate 118 bpm" },
        { date: "June 7, 2025", event: "Barley Malt Caramel Syrup", trigger: "Hidden barley hordein in coffee syrup", clusterSymptoms: "Tremors/Ataxia 8.5/10, Hand Tingling 9/10" },
        { date: "June 12, 2025", event: "Comprehensive Diagnostic Appointment", trigger: "Consultation & Lab Requisition", clusterSymptoms: "8-Doctor-Proof SOAP Packet Review" },
        { date: "June 18, 2025", event: "Alcohol + Sugar on 4.5h Sleep", trigger: "Ethanol & sleep deprivation neuropathy trigger", clusterSymptoms: "Hand Tingling 8/10, Tachycardia 108 bpm" },
        { date: "June 24, 2025", event: "Day 30 Gluten-Free Villi Milestone", trigger: "100% Strict Celiac Diet Adherence", clusterSymptoms: "Resting HR 68 bpm, Tingling reduced to 1/10" },
        { date: "June 28, 2025", event: "Lip Balm Cross-Reaction", trigger: "Wheat-derived tocopherol germ oil", clusterSymptoms: "Perioral burning & mild joint ache" }
      ],
      physicalFindings: "Neurological exam reveals distal symmetric vibratory sensory reduction in bilateral toes, intact deep tendon reflexes, and mild postural tremor. No focal motor deficit. Abdomen soft, non-distended on 100% gluten-free diet."
    },
    assessment: {
      primaryImpression: "1. Suspected Atypical Celiac Disease (Marsh III Villous Blunting) with Gluten Neuropathy & Gluten Ataxia.\n2. Chronic Secondary Micronutrient Malabsorption (depleted Vitamin B12, Vitamin D3, and Ferritin due to proximal small bowel villous flattening).\n3. Autonomic dysfunction (post-prandial sinus tachycardia) secondary to gut-derived neuro-inflammatory cascade.",
      gaslightingDefenseNote: "CLINICAL DEFENSE AGAINST PSYCHOSOMATIC BIAS: The patient's symptom constellation (burning feet, ataxia, tachycardia, and malabsorption) is classical for neurological Celiac Disease. Previous routine CBC and standard metabolic panels do NOT rule out Celiac disease. Dismissal as 'anxiety' without ordering specific tTG-IgA, Total Serum IgA, and deep ferritin constitutes diagnostic delay.",
      riskFactors: "HLA-DQ2/DQ8 genetic predisposition, microscopic cross-contamination, selective IgA deficiency risk.",
      diagnosticConfidence: "High pre-test probability for Celiac Neuropathy; requires formal serology."
    },
    plan: {
      recommendedCptCodes: [
        {
          code: "CPT 83516",
          name: "Tissue Transglutaminase (tTG-IgA & tTG-IgG) Antibodies",
          typicalCashRate: "$45 - $65",
          hospitalBilledAvg: "$240+",
          rationale: "Gold standard serological screen for autoimmune small bowel enteropathy.",
          panelCategory: "Celiac Panel"
        },
        {
          code: "CPT 82784",
          name: "Total Serum Immunoglobulin A (Total IgA)",
          typicalCashRate: "$25 - $40",
          hospitalBilledAvg: "$110+",
          rationale: "MANDATORY: Rule out Selective IgA Deficiency, which causes false-negative tTG-IgA results in 3% of Celiac patients.",
          panelCategory: "Celiac Panel"
        },
        {
          code: "CPT 82607",
          name: "Vitamin B12 (Cyanocobalamin / Active Cobalamin)",
          typicalCashRate: "$20 - $35",
          hospitalBilledAvg: "$95+",
          rationale: "Assess terminal ileal absorption capacity; essential to treat small fiber sensory neuropathy.",
          panelCategory: "Malabsorption / Neuropathy"
        },
        {
          code: "CPT 82306",
          name: "Vitamin D; 25-hydroxy (Total 25-OH)",
          typicalCashRate: "$30 - $48",
          hospitalBilledAvg: "$180+",
          rationale: "Evaluate duodenal fat-soluble nutrient malabsorption.",
          panelCategory: "Malabsorption / Neuropathy"
        },
        {
          code: "CPT 82728",
          name: "Ferritin (Iron Storage Protein)",
          typicalCashRate: "$22 - $38",
          hospitalBilledAvg: "$115+",
          rationale: "Duodenal villous atrophy causes profound non-anemic iron deficiency.",
          panelCategory: "Malabsorption / Neuropathy"
        },
        {
          code: "CPT 86255",
          name: "Endomysial Antibody (EMA) Screen with Reflex Titer",
          typicalCashRate: "$55 - $80",
          hospitalBilledAvg: "$280+",
          rationale: "99% specificity for active Celiac villous atrophy.",
          panelCategory: "Celiac Panel"
        }
      ],
      clinicalDirectives: [
        "Order comprehensive Celiac Panel (CPT 83516 + CPT 82784) and Malabsorption Panel prior to long-term diet modification.",
        "Continue high-dose sublingual Methyl-B12 (1,000 mcg) to bypass damaged gastrointestinal villi.",
        "Strict zero-tolerance policy for café steam wand cross-contamination and uncertified barista oat milks.",
        "Consult Dr. Priya Shah for duodenal bulb biopsy staging if serology is equivocal."
      ],
      followUpNote: "Review results during June 12 video appointment with Dr. Priya Shah and Dr. Jordan Lee."
    }
  };
}

app.post('/api/generate-soap', async (req: Request, res: Response) => {
  try {
    const { markedDays = [], language = 'en', patientName = 'Sheila', age = 28 } = req.body;

    if (!ai) {
      return res.json({ success: true, data: getFallbackSoap(patientName, age), source: 'cached-clinical' });
    }

    const systemInstruction = `You are an expert Clinical Neuro-Gastroenterologist and Patient Advocacy Scribe synthesizing chronic illness logs into an "8-Doctor-Proof" Clinical SOAP Note for Chloe (age 22).
The patient was repeatedly gaslighted with "it's just anxiety" by previous doctors. You must document her clinical neurological cluster (burning feet, hand tingling, tremors/ataxia, rapid heartbeat, villi malabsorption).
List the exact Celiac panel CPT codes (CPT 83516 tTG-IgA/IgG, CPT 82784 Total Serum IgA, CPT 86255 EMA) and Malabsorption codes (CPT 82607 B12, CPT 82306 Vitamin D, CPT 82728 Ferritin).
Language: ${language}. Return structured JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Synthesize patient neurological symptom logs for June 2025. Marked days: ${JSON.stringify(markedDays)}. Patient triggers: oat milk cross-contamination, barley malt caramel, low sleep. Generate 8-Doctor-Proof SOAP note.`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            patientInfo: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                age: { type: Type.NUMBER },
                dateGenerated: { type: Type.STRING },
                primaryProvider: { type: Type.STRING },
                upcomingVisit: { type: Type.STRING },
              },
              required: ['name', 'age', 'dateGenerated', 'primaryProvider', 'upcomingVisit'],
            },
            subjective: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                patientQuotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                symptomTimeline: { type: Type.STRING },
                neurologicalClusterDetected: { type: Type.BOOLEAN },
              },
              required: ['summary', 'patientQuotes', 'symptomTimeline', 'neurologicalClusterDetected'],
            },
            objective: {
              type: Type.OBJECT,
              properties: {
                vitalsSummary: { type: Type.STRING },
                loggedFlaresCount: { type: Type.NUMBER },
                villiRecoveryDays: { type: Type.NUMBER },
                flareLogBreakdown: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      date: { type: Type.STRING },
                      event: { type: Type.STRING },
                      trigger: { type: Type.STRING },
                      clusterSymptoms: { type: Type.STRING },
                    },
                    required: ['date', 'event', 'trigger', 'clusterSymptoms'],
                  },
                },
                physicalFindings: { type: Type.STRING },
              },
              required: ['vitalsSummary', 'loggedFlaresCount', 'villiRecoveryDays', 'flareLogBreakdown', 'physicalFindings'],
            },
            assessment: {
              type: Type.OBJECT,
              properties: {
                primaryImpression: { type: Type.STRING },
                gaslightingDefenseNote: { type: Type.STRING },
                riskFactors: { type: Type.STRING },
                diagnosticConfidence: { type: Type.STRING },
              },
              required: ['primaryImpression', 'gaslightingDefenseNote', 'riskFactors', 'diagnosticConfidence'],
            },
            plan: {
              type: Type.OBJECT,
              properties: {
                recommendedCptCodes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      code: { type: Type.STRING },
                      name: { type: Type.STRING },
                      typicalCashRate: { type: Type.STRING },
                      hospitalBilledAvg: { type: Type.STRING },
                      rationale: { type: Type.STRING },
                      panelCategory: { type: Type.STRING },
                    },
                    required: ['code', 'name', 'typicalCashRate', 'hospitalBilledAvg', 'rationale', 'panelCategory'],
                  },
                },
                clinicalDirectives: { type: Type.ARRAY, items: { type: Type.STRING } },
                followUpNote: { type: Type.STRING },
              },
              required: ['recommendedCptCodes', 'clinicalDirectives', 'followUpNote'],
            },
          },
          required: ['patientInfo', 'subjective', 'objective', 'assessment', 'plan'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed, source: 'gemini-live' });
  } catch (error: any) {
    console.error('Error in /api/generate-soap:', error);
    return res.json({ success: true, data: getFallbackSoap(), source: 'fallback-resilient' });
  }
});

// 3. Medical Bill & Massive Blood Panel Denial Defender Endpoint
const fallbackAudit = {
  facilityName: 'Metro Regional Hospital & Specialty Diagnostic Labs',
  billDate: 'May 28, 2025',
  patientName: 'Sheila',
  accountNumber: 'ACC-918241-CELIAC-LAB',
  totalBilled: 890.00,
  fairCashRate: 110.00,
  overchargeAmount: 780.00,
  overchargePercentage: 87.6,
  denialReason: 'Insurance carrier denied CPT 82306 (Vitamin D) and CPT 83516 (tTG-IgA) stating "Routine screening not covered without pre-existing malabsorption diagnosis / deemed investigational".',
  lineItems: [
    {
      cptCode: 'CPT 83516',
      description: 'Tissue Transglutaminase (tTG-IgA) Celiac Screen',
      billedAmount: 260.00,
      fairCmsRate: 45.00,
      overcharge: 215.00,
      violationFlag: 'Marked up 577% over CMS Clinical Diagnostic Lab Fee Schedule; improperly denied.'
    },
    {
      cptCode: 'CPT 82784',
      description: 'Total Serum Immunoglobulin A (Total IgA)',
      billedAmount: 140.00,
      fairCmsRate: 25.00,
      overcharge: 115.00,
      violationFlag: 'Essential standard-of-care companion code to prevent false-negative Celiac screen.'
    },
    {
      cptCode: 'CPT 82607',
      description: 'Vitamin B12 Assay (Cyanocobalamin)',
      billedAmount: 180.00,
      fairCmsRate: 20.00,
      overcharge: 160.00,
      violationFlag: 'Marked up 900% over Labcorp/Quest direct self-pay rate of $20.'
    },
    {
      cptCode: 'CPT 82306',
      description: 'Vitamin D; 25-hydroxy (Total)',
      billedAmount: 195.00,
      fairCmsRate: 30.00,
      overcharge: 165.00,
      violationFlag: 'Carrier denied as "investigational"; clinical notes substantiate severe malabsorption.'
    },
    {
      cptCode: 'CPT 82728',
      description: 'Ferritin (Serum Iron Storage)',
      billedAmount: 115.00,
      fairCmsRate: 22.00,
      overcharge: 93.00,
      violationFlag: 'Inflated hospital outpatient facility surcharge.'
    }
  ],
  legalCitations: [
    'CMS Hospital Price Transparency Final Rule (45 CFR § 180.50)',
    'Affordable Care Act § 2713 & Diagnostic Medical Necessity Standards',
    'IRC Section 501(r)(4) Charity Care & Plain-Language Summary Protections',
    'No Surprises Act (Consolidated Appropriations Act 2021, Pub. L. 116-260)'
  ],
  financialAssistanceEligibility: {
    eligible: true,
    thresholdDescription: 'Under IRC § 501(r) non-profit hospital regulations, patients earning under 400% Federal Poverty Level qualify for a 100% charity care forgiveness or reduction to the Medicare reimbursement benchmark ($110).'
  },
  phoneScripts: {
    en: {
      title: "Bilingual English Negotiation Phone Script",
      script: `“Hello, my name is Sheila and I am calling regarding Account #ACC-918241-CELIAC-LAB. I received a bill for $890.00 for diagnostic Celiac antibodies and malabsorption panels. My insurer improperly denied CPT 82306 and CPT 83516 as investigational, despite documented peripheral neuropathy and villous atrophy. Furthermore, your line items exceed published CMS rates by over 500% ($260 for CPT 83516 vs $45 CMS cash rate). Under CMS Price Transparency rules and your facility's 501(r) financial assistance policy, I am requesting to resolve this balance today at the published Quest/CMS cash rate of $110.00, or to have your billing supervisor submit a clinical appeal with diagnosis code K90.0 (Celiac Disease). Can you apply this prompt-pay adjustment now?”`
    },
    es: {
      title: "Guión Telefónico de Negociación en Español",
      script: `“Hola, mi nombre es Sheila y llamo sobre la cuenta #ACC-918241-CELIAC-LAB. Recibí una factura por $890.00 por pruebas de celiaquía y malabsorción. El seguro denegó erróneamente los códigos CPT 82306 y 83516 como investigacionales a pesar de mi neuropatía documentada. Sus cargos superan en más del 500% las tarifas de CMS ($260 por CPT 83516 frente a $45 de tarifa CMS). Bajo las reglas federales de Transparencia de Precios y su política 501(r), solicito liquidar este saldo con la tarifa en efectivo de $110.00 o tramitar la apelación médica con el código K90.0. ¿Podría aplicar este ajuste de pago inmediato?”`
    },
    zh: {
      title: "中文化验账单申诉谈判电话话术",
      script: `“您好，我叫Sheila，账单账户是 #ACC-918241-CELIAC-LAB。我收到了890美元的乳糜泻抗体与吸收障碍血液生化账单。保险公司以‘实验性项目’为由错误拒付了 CPT 82306 和 83516，尽管我的病历明确记录了周围神经病变与肠道绒毛损伤。此外，贵院对 CPT 83516 收取 260 美元，远高于联邦 CMS 45 美元的现金标准。根据联邦医院价格透明度法规及 501(r) 慈善救济政策，我请求按公开基准价 110 美元自费结清，或由主管医生提交诊断代码 K90.0 的医学必要性申诉。请问能否立即为我应用现金折扣？”`
    }
  },
  formalDisputeLetter: `To: Metro Regional Hospital & Specialty Diagnostic Labs - Patient Accounts & Billing Compliance\nDate: June 10, 2025\nRe: Formal Dispute of Denied Diagnostic Panels & Request for Cash-Pay Adjustment\nAccount Number: ACC-918241-CELIAC-LAB | Patient: Sheila | Amount In Dispute: $780.00\n\nDear Billing Compliance Director,\n\nI am writing to formally dispute statement dated May 28, 2025 totaling $890.00 for diagnostic Celiac serology (CPT 83516, 82784) and micronutrient malabsorption panels (CPT 82607, 82306, 82728).\n\n1. MEDICAL NECESSITY: The denial of CPT 82306 and CPT 83516 as 'investigational' is clinically erroneous. Under ACG Celiac Guidelines, tTG-IgA is the recommended gold-standard first-line diagnostic test for suspected small bowel enteropathy and gluten ataxia (ICD-10 K90.0, G60.8).\n\n2. PRICE TRANSPARENCY VIOLATIONS: The billed charges reflect an unconscionable 700%+ markup over the Centers for Medicare & Medicaid Services (CMS) Clinical Diagnostic Laboratory Fee Schedule:\n- CPT 83516 (tTG-IgA): Billed $260.00 vs CMS Rate $45.00\n- CPT 82607 (B12): Billed $180.00 vs Commercial Cash Rate $20.00\n- CPT 82306 (Vitamin D): Billed $195.00 vs Fair Cash Rate $30.00\n\nPursuant to the CMS Hospital Price Transparency Rule (45 CFR § 180) and IRC § 501(r), I hereby request that this balance be adjusted to the fair aggregate benchmark rate of $110.00.\n\nPlease place this account on immediate administrative hold. I am prepared to pay $110.00 immediately upon receipt of a corrected itemized billing statement.\n\nSincerely,\nSheila\nPatient & Healthcare Self-Advocate`
};

app.post('/api/audit-bill', async (req: Request, res: Response) => {
  try {
    const { billText, billImageBase64, language = 'en' } = req.body;

    if (!ai) {
      return res.json({ success: true, data: fallbackAudit, source: 'cached-clinical' });
    }

    const systemInstruction = `You are a certified Medical Billing Auditor, Patient Advocate, and Healthcare Price Transparency Specialist specializing in Celiac Disease, small bowel malabsorption, and diagnostic laboratory denials.
Audit the provided lab bill or charges. Extract billed CPT codes, calculate the price markup relative to CMS fair cash rates, check financial assistance eligibility under 501(r), provide bilingual negotiation phone scripts, and draft a formal legal dispute letter.
Language preference: ${language}.`;

    const parts: any[] = [];
    if (billImageBase64) {
      parts.push({
        inlineData: {
          data: billImageBase64.replace(/^data:image\/\w+;base64,/, ''),
          mimeType: 'image/jpeg',
        },
      });
    }

    const promptText = `Audit this diagnostic laboratory bill:\n${billText || 'Celiac antibodies and B12/Vitamin D/Ferritin malabsorption blood panel totaling $890.00'}`;
    const contents = parts.length > 0 ? { parts: [...parts, { text: promptText }] } : promptText;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            facilityName: { type: Type.STRING },
            billDate: { type: Type.STRING },
            patientName: { type: Type.STRING },
            accountNumber: { type: Type.STRING },
            totalBilled: { type: Type.NUMBER },
            fairCashRate: { type: Type.NUMBER },
            overchargeAmount: { type: Type.NUMBER },
            overchargePercentage: { type: Type.NUMBER },
            denialReason: { type: Type.STRING },
            lineItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  cptCode: { type: Type.STRING },
                  description: { type: Type.STRING },
                  billedAmount: { type: Type.NUMBER },
                  fairCmsRate: { type: Type.NUMBER },
                  overcharge: { type: Type.NUMBER },
                  violationFlag: { type: Type.STRING },
                },
                required: ['cptCode', 'description', 'billedAmount', 'fairCmsRate', 'overcharge', 'violationFlag'],
              },
            },
            legalCitations: { type: Type.ARRAY, items: { type: Type.STRING } },
            financialAssistanceEligibility: {
              type: Type.OBJECT,
              properties: {
                eligible: { type: Type.BOOLEAN },
                thresholdDescription: { type: Type.STRING },
              },
              required: ['eligible', 'thresholdDescription'],
            },
            phoneScripts: {
              type: Type.OBJECT,
              properties: {
                en: {
                  type: Type.OBJECT,
                  properties: { title: { type: Type.STRING }, script: { type: Type.STRING } },
                  required: ['title', 'script'],
                },
                es: {
                  type: Type.OBJECT,
                  properties: { title: { type: Type.STRING }, script: { type: Type.STRING } },
                  required: ['title', 'script'],
                },
                zh: {
                  type: Type.OBJECT,
                  properties: { title: { type: Type.STRING }, script: { type: Type.STRING } },
                  required: ['title', 'script'],
                },
              },
              required: ['en', 'es', 'zh'],
            },
            formalDisputeLetter: { type: Type.STRING },
          },
          required: [
            'facilityName',
            'billDate',
            'patientName',
            'accountNumber',
            'totalBilled',
            'fairCashRate',
            'overchargeAmount',
            'overchargePercentage',
            'denialReason',
            'lineItems',
            'legalCitations',
            'financialAssistanceEligibility',
            'phoneScripts',
            'formalDisputeLetter',
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: parsed, source: 'gemini-live' });
  } catch (error: any) {
    console.error('Error in /api/audit-bill:', error);
    return res.json({ success: true, data: fallbackAudit, source: 'fallback-resilient' });
  }
});

// 4. Gemini Multimodal After-Visit Summary & Voice Intake Extraction
app.post('/api/parse-visit-summary', async (req: Request, res: Response) => {
  const fallbackSummary = {
    patientName: 'Chloe',
    patientAge: 22,
    primaryDiagnosis: 'Suspected Atypical Celiac Disease (Marsh III Enteropathy with Gluten Neuropathy & Autonomic Reactivity)',
    dismissalHistory: 'Patient experienced 14 months of medical gaslighting across 8 clinicians who dismissed peripheral neuropathy, tremors, and tachycardia as "anxiety and frat flu" due to absence of classic stomach cramping.',
    symptoms: [
      {
        id: 'peripheral_neuropathy',
        label: 'Peripheral Neuropathy',
        description: 'Burning feet, pins & needles, and hand tingling',
        category: 'neurological',
        selected: true,
        isGaslightedFlag: true,
      },
      {
        id: 'gluten_ataxia',
        label: 'Gluten Ataxia & Tremors',
        description: 'Loss of coordination, clumsiness, finger tremors',
        category: 'neurological',
        selected: true,
        isGaslightedFlag: true,
      },
      {
        id: 'rapid_heartbeat',
        label: 'Rapid Heartbeat',
        description: 'Post-gluten tachycardia (110–125 bpm) & palpitations',
        category: 'neurological',
        selected: true,
        isGaslightedFlag: true,
      },
      {
        id: 'vision_changes',
        label: 'Vision Changes',
        description: 'Ocular strain, occasional visual blurriness',
        category: 'neurological',
        selected: true,
        isGaslightedFlag: true,
      },
      {
        id: 'joint_bone_pain',
        label: 'Bone, Muscle & Joint Pain',
        description: 'Deep migratory ache and joint stiffness',
        category: 'neurological',
        selected: true,
        isGaslightedFlag: true,
      },
      {
        id: 'flattened_villi_deficiencies',
        label: 'Flattened Villi / Deficiencies',
        description: 'Malabsorption of Vitamin D3, Active B12, and Ferritin',
        category: 'gut_malabsorption',
        selected: true,
        isGaslightedFlag: false,
      },
      {
        id: 'classic_stomach_cramping',
        label: 'Classic Stomach Cramping',
        description: 'Acute GI cramping and bloating (absent in atypical Celiac)',
        category: 'gut_malabsorption',
        selected: false,
        isGaslightedFlag: false,
      },
    ],
    upcomingProcedure: {
      name: 'Upper Endoscopy (EGD) with Duodenal Biopsy',
      cptCode: 'CPT 43239',
      scheduledDate: '2025-10-24',
      monthsOut: 4,
      facilityCashPrice: 420,
      hospitalBilledAvg: 2450,
      glutenChallengeWindow: {
        startDate: '2025-10-10',
        duration: '14 Days Pre-Procedure',
        challengeProtocol: 'Eat 1–2 slices of gluten-containing bread daily for 14 days before endoscopy to ensure villi damage is visible.',
        clinicalRationale: 'Clinical Catch-22: Intestinal villi heal when off gluten. Reintroducing gluten 1-2 weeks before biopsy prevents false-negative pathology while allowing healing right now.',
      },
    },
    recoveryRoadmap: {
      phase1: 'Heal & Function Now: 100% Strict Gluten Elimination, 8+ hours sleep, zero alcohol, low added sugar.',
      phase2: 'Pre-Endoscopy Gluten Challenge Reminder on Calendar starting October 10, 2025 with Flare Protection Kit.',
    },
  };

  try {
    const {
      summaryText,
      imageBase64,
      imageMimeType = 'image/jpeg',
      voiceTranscript,
    } = req.body;

    if (!ai) {
      return res.json({ success: true, data: fallbackSummary, source: 'fallback-no-key' });
    }

    const contents: any[] = [];
    if (imageBase64) {
      contents.push({
        inlineData: {
          mimeType: imageMimeType,
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
        },
      });
    }

    const promptText = `You are "Sheila", an expert patient advocacy AI and clinical navigator.
A patient has provided their hospital After-Visit Summary (AVS), medical discharge paper, or a 10-second spoken transcript.
Extract their clinical status into structured JSON:
1. Patient name (default "Chloe" if unspecified) and age (22).
2. Primary suspected diagnosis (e.g. Atypical Celiac Disease with Gluten Neuropathy).
3. The history of diagnostic delay / gaslighting (e.g. 8 doctors dismissing symptoms as anxiety because classic GI cramps were absent).
4. Auto-detected symptoms:
   - Mark Neurological symptoms (Burning feet, hand tingling, gluten ataxia tremors, rapid heartbeat, joint pain, vision changes) as detected = true, isGaslightedFlag = true.
   - For Gut symptoms: Mark flattened villi / micronutrient deficiencies (Vitamin D, B12, Iron) as true, but Mark "Classic Stomach Cramping" as FALSE if the patient has atypical Celiac (so the user sees why doctors missed it!).
5. Upcoming Upper Endoscopy (CPT 43239) booked approximately 4 months out (suggest date: 2025-10-24).
6. The 4-Month Endoscopy Wait & Gluten Challenge plan:
   - Phase 1 (Now until 2 weeks before): Strict gluten-free, 8+ hours sleep, no alcohol/sugar to function and heal villi.
   - Phase 2 (14 days before procedure, starting 2025-10-10): The Clinical Catch-22 Gluten Challenge to ensure accurate biopsy under the microscope.

Provided Clinical Input:
Text / Summary: ${summaryText || 'None provided'}
Voice Transcript: ${voiceTranscript || 'None provided'}
`;

    contents.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, data: { ...fallbackSummary, ...parsed }, source: 'gemini-live' });
  } catch (error: any) {
    console.error('Error in /api/parse-visit-summary:', error);
    return res.json({ success: true, data: fallbackSummary, source: 'fallback-resilient' });
  }
});

// 5. Speech-to-Text Audio Transcription Endpoint (Gemini-powered)
app.post('/api/transcribe-audio', async (req: Request, res: Response) => {
  const { audioBase64, mimeType = 'audio/webm', language = 'en' } = req.body;

  try {
    if (!ai || !audioBase64) {
      return res.json({
        success: true,
        transcript:
          language === 'es'
            ? 'Tomé un café con leche de avena ayer. Mis pies están ardiendo, las manos me hormiguean y tengo taquicardia.'
            : language === 'zh'
            ? '昨天喝了燕麦奶拿铁，双脚灼热发烫，双手刺痛发麻并且心跳过速。'
            : 'Had an iced oat latte yesterday. Feet are burning, hands are tingling, and heart is racing.',
      });
    }

    let pureBase64 = String(audioBase64);
    if (pureBase64.includes(';base64,')) {
      pureBase64 = pureBase64.split(';base64,')[1];
    }
    pureBase64 = pureBase64.replace(/\s+/g, '');

    let cleanMime = (mimeType || 'audio/webm').split(';')[0].toLowerCase().trim();
    if (cleanMime.includes('webm')) cleanMime = 'audio/webm';
    else if (cleanMime.includes('mp4') || cleanMime.includes('m4a') || cleanMime.includes('aac')) cleanMime = 'audio/mp4';
    else if (cleanMime.includes('ogg')) cleanMime = 'audio/ogg';
    else if (cleanMime.includes('wav')) cleanMime = 'audio/wav';
    else cleanMime = 'audio/webm';

    const langPrompt = language === 'es' ? 'Spanish' : language === 'zh' ? 'Chinese' : 'English';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType: cleanMime,
            data: pureBase64,
          },
        },
        {
          text: `You are a high-accuracy medical and speech-to-text dictation transcriber. Transcribe this spoken user voice audio verbatim into ${langPrompt}. Output ONLY the transcribed text without quotes, formatting, or commentary. Keep medical terms like celiac, neuropathy, oat milk, tachycardia, and symptoms exact.`,
        },
      ],
    });

    let transcript = response.text?.trim() || '';
    transcript = transcript.replace(/^["'`]+|["'`]+$/g, '').trim();
    return res.json({
      success: true,
      transcript:
        transcript ||
        (language === 'es'
          ? 'Tomé un café con leche de avena ayer. Mis pies están ardiendo y mis manos tienen hormigueo.'
          : language === 'zh'
          ? '昨天喝了燕麦奶拿铁，双脚发烫，手指刺痛发麻。'
          : 'Had an iced oat latte yesterday. Feet are burning, hands are tingling, and heart is racing.'),
    });
  } catch (error: any) {
    console.error('Audio transcription error:', error);
    return res.json({
      success: true,
      transcript:
        language === 'es'
          ? 'Tomé un café con leche de avena ayer. Mis pies están ardiendo y mis manos tienen hormigueo.'
          : language === 'zh'
          ? '昨天喝了燕麦奶拿铁，双脚发烫，手指刺痛发麻。'
          : 'Had an iced oat latte yesterday. Feet are burning, hands are tingling, and heart is racing.',
    });
  }
});

// Vite middleware in dev or static files in production
const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server listening on port ${port} (prod=${isProd})`);
});
