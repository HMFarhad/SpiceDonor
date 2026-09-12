import fs from 'node:fs/promises';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const outputPath = new URL('../outputs/menu/menu.xlsx', import.meta.url).pathname;
const itemImageDir = new URL('../src/assets/images/Items/', import.meta.url);
const normalizeProductName = value => value
  .normalize('NFKC')
  .trim()
  .toLocaleLowerCase('fi')
  .replace(/[‐‑‒–—―−]/g, '-')
  .replace(/\s*-\s*/g, '-')
  .replace(/\s+/g, ' ');

const itemImagesByName = await fs.readdir(itemImageDir)
  .then(files => files
    .filter(file => /\.(jpe?g|png|webp|avif)$/i.test(file))
    .sort((a, b) => a.localeCompare(b))
    .reduce((images, file) => {
      const productName = normalizeProductName(file.replace(/\.[^.]+$/, ''));
      if (images.has(productName)) {
        throw new Error(`Duplicate product image name: ${file}`);
      }
      images.set(productName, file);
      return images;
    }, new Map()))
  .catch(error => {
    if (error?.code === 'ENOENT') return new Map();
    throw error;
  });

const multiImageSelections = new Map([
  ['chicken_doner', ['Kana Döner', 'Kana Wrap']],
  ['mixed_doner', ['Kana Döner', 'Nauta Döner']],
  ['vegetarian_feta_eggplant', ['Munakoiso-Kukkakaali Pita', 'Munakoiso - Brokkoli Pita']],
  ['eggplant_cauliflower_broccoli', ['Munakoiso-Kukkakaali Pita', 'Munakoiso - Brokkoli Pita']],
  ['mixed_mezze', ['Kana Döner Mezze Bowl', 'Nauta Döner Mezze Bowl']],
  ['doner_fries_bowl', ['Kana Döner Ranskalaiset Bowl', 'Döner Ranskalaiset Bowl Naudalla']],
  ['doner_rice_bowl', ['Döner Riisi Bowl Kanalla', 'Döner Riisi Bowl Naudalla']],
  ['doner_iskander_bowl', ['Döner Iskander Bowl Kanalla', 'Döner Iskander Bowl Naudalla']],
  ['kids_doner_fries', ['Kana Döner Ranskalaiset Bowl', 'Döner Ranskalaiset Bowl Naudalla']],
  ['cauliflower_broccoli_hummus', ['Kukkakaali & Hummus', 'Brokkoli & Hummus']]
]);

const imageUrlOverrides = new Map([
  ['fish_chips', ['assets/images/Fish n Chips.png']]
]);

const getProductImages = productName => {
  const baseImage = itemImagesByName.get(normalizeProductName(productName));
  const mealName = /\s+pita$/i.test(productName)
    ? productName.replace(/\s+pita$/i, ' Ateria')
    : `${productName} Ateria`;
  const mealImage = itemImagesByName.get(normalizeProductName(mealName));
  return [baseImage, mealImage].filter(Boolean);
};

const categories = [
  ['pita_meat', 'Pitas & Wraps - Chicken & Beef', 'Pitat & wrapit - Kana & naudanliha', 'Every item in this section can be served as either a pita or a wrap. Add a meal with fries and Coke for €3.', 'Jokainen tämän osion annos voidaan tarjoilla joko pitana tai wrappina. Lisää ateria ranskalaisilla ja Coca-Colalla +3 €.', 1, true],
  ['pita_veg', 'Pitas & Wraps - Vegetarian & Vegan', 'Pitat & wrapit - Kasvis & vegaani', 'Every item in this section can be served as either a pita or a wrap. Add a meal with fries and Coke for €3.', 'Jokainen tämän osion annos voidaan tarjoilla joko pitana tai wrappina. Lisää ateria ranskalaisilla ja Coca-Colalla +3 €.', 2, true],
  ['mezze_bowls', 'Mezze Bowls', 'Mezze bowlit', 'Served with fresh pide bread. Add a meal with fries and Coke for €3.', 'Kaikkiin annoksiin kuuluu tuoretta pide-leipää. Lisää ateria ranskalaisilla ja Coca-Colalla +3 €.', 3, true],
  ['doner_bowls', 'Döner Bowls', 'Döner bowlit', 'Add a meal with fries and Coke for €3.', 'Lisää ateria ranskalaisilla ja Coca-Colalla +3 €.', 4, true],
  ['children', "Children's Menu", 'Lasten menu', '', '', 5, true],
  ['sides', 'Sides & Snacks', 'Lisukkeet & snacks', '', '', 6, true],
  ['beverages', 'Drinks', 'Juomat', '', '', 7, true],
  ['dips', 'Dips & Extra Sauces', 'Dipit & ekstrakastikkeet', '€1.50 each.', '1,50 € / kpl.', 8, true],
];

const items = [];
const add = (id, category, en, fi, descEn, descFi, price, large = '', tags = '', extra = {}) => {
  items.push([
    id, category, en, fi, descEn, descFi, price, large,
    extra.priceAlt ?? '', extra.priceAltLarge ?? '',
    extra.priceLabelEn ?? '', extra.priceLabelFi ?? '',
    extra.priceAltLabelEn ?? '', extra.priceAltLabelFi ?? '',
    '', 'EUR', tags, extra.allergens ?? '', true,
    extra.imageUrl ?? '', extra.orderLinks ?? '', extra.optionGroupIds ?? ''
  ]);
};

add('chicken_doner', 'pita_meat', 'Chicken Döner', 'Kana Döner', 'Chicken döner, tzatziki, kebab sauce, curry mayo, garlic mayo, tomato, cucumber, fresh salad mix, red cabbage, roasted onion, sumac onion, parsley, chili and feta.', 'Kana-döneriä, tzatzikia, kebabkastiketta, currymajoneesia, valkosipulimajoneesia, tomaattia, kurkkua, tuoretta salaattisekoitusta, punakaalia, paahdettua sipulia, sumakkisipulia, persiljaa, chiliä ja fetaa.', 12.5, 15.5, 'L,(G)');
add('halloumi_chicken_doner', 'pita_meat', 'Halloumi-Chicken Döner', 'Halloumi-Kana Döner', 'Chicken döner, grilled halloumi, tzatziki, kebab sauce, curry mayo, garlic mayo, tomato, cucumber, fresh salad mix, red cabbage, roasted onion, sumac onion, parsley, chili and feta.', 'Kana-döneriä, paistettua halloumia, tzatzikia, kebabkastiketta, currymajoneesia, valkosipulimajoneesia, tomaattia, kurkkua, tuoretta salaattisekoitusta, punakaalia, paahdettua sipulia, sumakkisipulia, persiljaa, chiliä ja fetaa.', 13.5, 16.5, 'L,(G)');
add('beef_doner', 'pita_meat', 'Beef Döner', 'Nauta Döner', 'Finnish beef döner, tzatziki, kebab sauce, chili mayo, garlic mayo, tomato, cucumber, fresh salad mix, red cabbage, roasted onion, sumac onion, parsley, chili and feta.', 'Kotimaista naudan döneriä, tzatzikia, kebabkastiketta, chilimajoneesia, valkosipulimajoneesia, tomaattia, kurkkua, tuoretta salaattisekoitusta, punakaalia, paahdettua sipulia, sumakkisipulia, persiljaa, chiliä ja fetaa.', 13.9, 16.9, 'L,(G)');
add('halloumi_beef_doner', 'pita_meat', 'Halloumi-Beef Döner', 'Halloumi-Nauta Döner', 'Finnish beef döner, grilled halloumi, tzatziki, kebab sauce, chili mayo, garlic mayo, tomato, cucumber, fresh salad mix, red cabbage, roasted onion, sumac onion, parsley, chili and feta.', 'Kotimaista naudan döneriä, paistettua halloumia, tzatzikia, kebabkastiketta, chilimajoneesia, valkosipulimajoneesia, tomaattia, kurkkua, tuoretta salaattisekoitusta, punakaalia, paahdettua sipulia, sumakkisipulia, persiljaa, chiliä ja fetaa.', 14.5, 17.5, 'L,(G)');
add('mixed_doner', 'pita_meat', 'Mixed Döner', 'Mixed Döner', 'Chicken and beef döner, grilled halloumi, tzatziki, kebab sauce, chili mayo, garlic mayo, tomato, cucumber, fresh salad mix, red cabbage, roasted onion, sumac onion, parsley, chili and feta.', 'Kana- ja naudan döneriä, paistettua halloumia, tzatzikia, kebabkastiketta, chilimajoneesia, valkosipulimajoneesia, tomaattia, kurkkua, tuoretta salaattisekoitusta, punakaalia, paahdettua sipulia, sumakkisipulia, persiljaa, chiliä ja fetaa.', 14.5, 17.5, 'L,(G)');

add('vegetarian_halloumi', 'pita_veg', 'Vegetarian Halloumi', 'Kasvis-Halloumi', 'Choose crispy falafel or seitan döner (+€1). Grilled halloumi, tzatziki, hummus, tomato, cucumber, fresh salad mix, tabbouleh, cucumber or vegan mayo, red cabbage, roasted onion, sumac onion, parsley, chili and feta.', 'Valintasi mukaan rapeaa falafelia tai seitan-döneriä (+1,00 €). Paistettua halloumia, tzatzikia, hummusta, tomaattia, kurkkua, tuoretta salaattisekoitusta, tabouleh-salaattia, kurkku- tai vegaanista majoneesia, punakaalia, paahdettua sipulia, sumakkisipulia, persiljaa, chiliä ja fetaa.', 12.5, 15.5, 'L,K,(G)');
add('goat_cheese_vegetarian', 'pita_veg', 'Goat Cheese & Vegetarian', 'Vuohenjuusto & Kasvis', 'Choose crispy falafel or seitan döner (+€1). Grilled goat cheese, hummus, pesto, tomato, cucumber, fresh salad mix, tabbouleh, cucumber or vegan mayo, red cabbage, roasted onion, sumac onion, parsley, chili and feta.', 'Valintasi mukaan rapeaa falafelia tai seitan-döneriä (+1,00 €). Paistettua vuohenjuustoa, hummusta, pestoa, tomaattia, kurkkua, tuoretta salaattisekoitusta, tabouleh-salaattia, kurkku- tai vegaanista majoneesia, punakaalia, paahdettua sipulia, sumakkisipulia, persiljaa, chiliä ja fetaa.', 12.5, 15.5, 'L,K,(G)');
add('vegetarian_feta_eggplant', 'pita_veg', 'Vegetarian Feta & Eggplant', 'Kasvis Feta & Munakoiso', 'Choose crispy falafel or seitan döner (+€1). Grilled eggplant, feta, tzatziki, hummus, tomato, cucumber, fresh salad mix, tabbouleh, cucumber or vegan mayo, red cabbage, roasted onion, sumac onion, parsley and chili.', 'Valintasi mukaan rapeaa falafelia tai seitan-döneriä (+1,00 €). Paistettua munakoisoa, fetaa, tzatzikia, hummusta, tomaattia, kurkkua, tuoretta salaattisekoitusta, tabouleh-salaattia, kurkku- tai vegaanista majoneesia, punakaalia, paahdettua sipulia, sumakkisipulia, persiljaa, chiliä ja fetaa.', 12.5, 15.5, 'L,K,(G)');
add('eggplant_cauliflower_broccoli', 'pita_veg', 'Eggplant-Cauliflower or Broccoli', 'Munakoiso-Kukkakaali tai Brokkoli', 'Choose grilled cauliflower or broccoli. Grilled eggplant, 3 falafel, hummus, house tomato sauce, tomato, cucumber, fresh salad mix, tabbouleh, red cabbage, sumac onion, vegan mayo, parsley, chili and feta.', 'Valintasi mukaan paistettua kukkakaalia tai parsakaalia. Lisäksi paistettua munakoisoa, 3 kpl falafelia, hummusta, talon tomaattikastiketta, tomaattia, kurkkua, tuoretta salaattisekoitusta, tabouleh-salaattia, punakaalia, sumakkisipulia, vegaanimajoneesia, persiljaa, chiliä ja fetaa.', 12.5, 15.5, 'V,G');
add('house_vegan', 'pita_veg', 'House Vegan', 'Talon Vegaaninen', 'Choose 5 falafel or seitan döner (+€1). Hummus, house tomato sauce, tomato, cucumber, fresh salad mix, pickles, red cabbage, roasted onion, sumac onion, vegan mayo, parsley, chili and feta.', 'Valintasi mukaan 5 kpl falafelia tai seitan-döneriä (+1,00 €). Hummusta, talon tomaattikastiketta, tomaattia, kurkkua, tuoretta salaattisekoitusta, suolakurkkua, punakaalia, paahdettua sipulia, sumakkisipulia, vegaanimajoneesia, persiljaa, chiliä ja fetaa.', 11.5, 14.5, 'V,L,(G)');
add('be_the_chef_pita', 'pita_veg', 'Be The Chef! - Custom Pita / Wrap', 'Be The Chef! - Oma Valinta Pita / Wrappi', 'Choose sauces freely, fillings, a side and one protein: chicken döner, beef döner, falafel, seitan döner, cauliflower, broccoli, halloumi, feta or goat cheese.', 'Valitse vapaasti kastikkeet ja täytteet, lisukkeeksi riisi, ranskalaiset tai pide-leipä sekä yksi proteiini.', 14.5, 17.5, '');

add('chicken_mezze', 'mezze_bowls', 'Chicken Döner Mezze Bowl', 'Kana Döner Mezze Bowl', 'Chicken döner, 2 falafel, hummus, tzatziki, curry mayo, garlic mayo, eggplant, chickpeas, tomato, cucumber, salad mix, tabbouleh, red cabbage, roasted onion, sumac onion, parsley, chili and feta.', 'Kana-döneriä, 2 kpl falafelia, hummusta, tzatzikia, currymajoneesia, valkosipulimajoneesia, paistettua munakoisoa, kikherneitä, tomaattia, kurkkua, salaattisekoitusta, tabouleh-salaattia, punakaalia, paahdettua sipulia, sumakkisipulia, persiljaa, chiliä ja fetaa.', 13.5, 16.5, 'L,(G)');
add('beef_mezze', 'mezze_bowls', 'Beef Döner Mezze Bowl', 'Nauta Döner Mezze Bowl', 'Beef döner, 2 falafel, hummus, tzatziki, chili mayo, garlic mayo, eggplant, chickpeas, tomato, cucumber, salad mix, tabbouleh, red cabbage, roasted onion, sumac onion, parsley, chili and feta.', 'Naudan döneriä, 2 kpl falafelia, hummusta, tzatzikia, chilimajoneesia, valkosipulimajoneesia, paistettua munakoisoa, kikherneitä, tomaattia, kurkkua, salaattisekoitusta, tabouleh-salaattia, punakaalia, paahdettua sipulia, sumakkisipulia, persiljaa, chiliä ja fetaa.', 14.5, 17.5, 'L,(G)');
add('halloumi_mezze', 'mezze_bowls', 'Halloumi Mezze Bowl', 'Halloumi Mezze Bowl', 'Grilled halloumi, 4 falafel, tzatziki, hummus, cucumber or vegan mayo, eggplant, chickpeas, tomato, cucumber, salad mix, tabbouleh, red cabbage, roasted onion, sumac onion, pomegranate seeds, parsley, chili and feta.', 'Paistettua halloumia, 4 kpl falafelia, tzatzikia, hummusta, kurkku- tai vegaanista majoneesia, paistettua munakoisoa, kikherneitä, tomaattia, kurkkua, salaattisekoitusta, tabouleh-salaattia, punakaalia, paahdettua sipulia, sumakkisipulia, granaattiomenan siemeniä, persiljaa, chiliä ja fetaa.', 12.9, 15.9, 'K,(G)');
add('goat_cheese_mezze', 'mezze_bowls', 'Goat Cheese Mezze Bowl', 'Vuohenjuusto Mezze Bowl', 'Grilled goat cheese, 4 falafel, hummus, pesto, cucumber or vegan mayo, eggplant, chickpeas, tomato, cucumber, salad mix, tabbouleh, red cabbage, roasted onion, sumac onion, pomegranate seeds, parsley, chili and feta.', 'Paistettua vuohenjuustoa, 4 kpl falafelia, hummusta, pestoa, kurkku- tai vegaanista majoneesia, paistettua munakoisoa, kikherneitä, tomaattia, kurkkua, salaattisekoitusta, tabouleh-salaattia, punakaalia, paahdettua sipulia, sumakkisipulia, granaattiomenan siemeniä, persiljaa, chiliä ja fetaa.', 12.9, 15.9, 'L,K,(G)');
add('feta_mezze', 'mezze_bowls', 'Feta Mezze Bowl', 'Feta Mezze Bowl', 'Grilled feta, olives, 4 falafel, tzatziki, hummus, cucumber or vegan mayo, eggplant, chickpeas, tomato, cucumber, salad mix, tabbouleh, pomegranate, red cabbage, roasted onion, sumac onion, parsley, chili and crumbled feta.', 'Paistettua fetaa, oliiveja, 4 kpl falafelia, tzatzikia, hummusta, kurkku- tai vegaanista majoneesia, paistettua munakoisoa, kikherneitä, tomaattia, kurkkua, salaattisekoitusta, tabouleh-salaattia, punakaalia, paahdettua sipulia, sumakkisipulia, granaattiomenan siemeniä, persiljaa, chiliä ja murustettua fetaa.', 12.9, 15.9, 'L,K,(G)');
add('vegan_mezze', 'mezze_bowls', 'Vegan Mezze Bowl', 'Vegan Mezze Bowl', '5 falafel, grilled cauliflower or broccoli, hummus, house tomato sauce, cucumber or vegan mayo, eggplant, chickpeas, tomato, cucumber, salad mix, tabbouleh, red cabbage, roasted onion, sumac onion, parsley, chili and feta.', '5 kpl falafelia, paistettua kukkakaalia tai parsakaalia, hummusta, talon tomaattikastiketta, kurkku- tai vegaanista majoneesia, paistettua munakoisoa, kikherneitä, tomaattia, kurkkua, salaattisekoitusta, tabouleh-salaattia, punakaalia, paahdettua sipulia, sumakkisipulia, persiljaa, chiliä ja fetaa.', 12.9, 15.9, 'V,(G)');
add('mixed_mezze', 'mezze_bowls', 'Mixed Mezze', 'Mixed Mezze', 'Chicken and beef döner, halloumi, tzatziki, kebab sauce, chili mayo, garlic mayo, eggplant, chickpeas, tomato, cucumber, salad mix, tabbouleh, red cabbage, roasted onion, sumac onion, parsley, chili and feta.', 'Kana- ja naudan döneriä, paistettua halloumia, tzatzikia, kebabkastiketta, chilimajoneesia, valkosipulimajoneesia, paistettua munakoisoa, kikherneitä, tomaattia, kurkkua, salaattisekoitusta, tabouleh-salaattia, punakaalia, paahdettua sipulia, sumakkisipulia, persiljaa, chiliä ja fetaa.', 14.9, 17.9, 'L,(G)');

const bowlExtra = { priceLabelEn: 'Chicken', priceLabelFi: 'Kanalla', priceAlt: 13.9, priceAltLarge: 16.9, priceAltLabelEn: 'Beef', priceAltLabelFi: 'Naudalla' };
add('doner_fries_bowl', 'doner_bowls', 'Döner French Fries Bowl', 'Döner Ranskalaiset Bowl', 'Your choice of döner, seasoned fries, curry or chili mayo, garlic mayo, kebab sauce, hummus, tzatziki, tomato-cucumber-iceberg salad, pickles, jalapeño, red cabbage, roasted onion, sumac onion, parsley, chili and feta.', 'Valitsemasi döner-liha, rapeita maustettuja ranskalaisia, curry- tai chilimajoneesia, valkosipulimajoneesia, kebabkastiketta, hummusta, tzatzikia, tomaatti-kurkku-jäävuorisalaattisekoitusta, suolakurkkua, jalapenoja, punakaalia, paahdettua sipulia, sumakkisipulia, persiljaa, chiliä ja fetaa.', 12.9, 15.9, 'L,(G)', bowlExtra);
add('doner_rice_bowl', 'doner_bowls', 'Döner Rice Bowl', 'Döner Riisi Bowl', 'Your choice of döner, steamed rice, curry or chili mayo, garlic mayo, kebab sauce, hummus, tzatziki, chickpeas, tomato-cucumber-iceberg salad, pickles, jalapeño, red cabbage, roasted onion, sumac onion, parsley, chili and feta.', 'Valitsemasi döner-liha, höyryävää riisiä, curry- tai chilimajoneesia, valkosipulimajoneesia, kebabkastiketta, hummusta, tzatzikia, kikherneitä, tomaatti-kurkku-jäävuorisalaattisekoitusta, suolakurkkua, jalapenoja, punakaalia, paahdettua sipulia, sumakkisipulia, persiljaa, chiliä ja fetaa.', 12.9, 15.9, 'L,(G)', bowlExtra);
add('doner_iskander_bowl', 'doner_bowls', 'Döner Iskander Bowl', 'Döner Iskander Bowl', 'Your choice of döner, toasted pide cubes, curry or chili mayo, garlic mayo, kebab sauce, hummus, tzatziki, tomato-cucumber-iceberg salad, pickles, jalapeño, red cabbage, sumac onion, parsley, chili and feta.', 'Valitsemasi döner-liha, paahdettuja pide-leipäkuutioita, curry- tai chilimajoneesia, valkosipulimajoneesia, kebabkastiketta, hummusta, tzatzikia, tomaatti-kurkku-jäävuorisalaattisekoitusta, suolakurkkua, jalapenoja, punakaalia, sumakkisipulia, persiljaa, chiliä ja fetaa.', 12.9, 15.9, 'L,(G)', bowlExtra);
add('voner_bowl', 'doner_bowls', 'Vöner Fries / Rice / Iskander Bowl', 'Vöner Ranskalaiset / Riisi / Iskander Bowl', 'Seitan döner with fries, rice or toasted pide cubes. Hummus, house tomato sauce, cucumber or vegan mayo, tomato-cucumber-iceberg salad, pickles, jalapeño, red cabbage, sumac onion, parsley, chili and feta.', 'Seitan-döneriä, valintasi mukaan joko ranskalaisia, riisiä tai paahdettuja pide-leipäkuutioita. Lisäksi hummusta, talon tomaattikastiketta, kurkku- tai vegaanista majoneesia, tomaatti-kurkku-jäävuorisalaattisekoitusta, suolakurkkua, jalapenoja, punakaalia, sumakkisipulia, persiljaa, chiliä ja fetaa.', 12.9, 15.9, 'V');
add('house_special_bowl', 'doner_bowls', 'House Special Bowl', 'Talon Special Bowl', 'Beef and chicken döner, toasted pide cubes, fries, rice, curry mayo, chili mayo, garlic mayo, kebab sauce, hummus, tzatziki, tomato-cucumber salad, pickles, jalapeño, red cabbage, sumac onion, parsley, chili and feta.', 'Naudan ja kanan döneriä, paahdettuja pide-leipäkuutioita, ranskalaisia, riisiä, currymajoneesia, chilimajoneesia, valkosipulimajoneesia, kebabkastiketta, hummusta, tzatzikia, tomaatti-kurkku-salaattisekoitusta, suolakurkkua, jalapenoja, punakaalia, sumakkisipulia, persiljaa, chiliä ja fetaa.', 14.5, 17.5, '');
add('be_the_chef_bowl', 'doner_bowls', 'Be The Chef! - Custom Bowl', 'Be The Chef! - Oma Bowl', 'Customize your bowl from the same sauces, fillings, bases and proteins as the custom pita / wrap.', 'Kustomoi oma kulhosi samoista kastike-, täyte-, pohja- ja proteiinivaihtoehdoista kuin Oma valinta Pita / Wrappi.', 14.5, 17.5, '');

add('kids_doner_fries', 'children', 'Kids Chicken / Beef Döner & Fries', 'Lasten Kana / Nauta Döner & Ranskalaiset', 'Your choice of döner, 2 falafel, fries, ketchup, hummus, tzatziki, tomato and cucumber.', 'Valitsemaasi döner-lihaa, 2 kpl falafelia, ranskalaisia, ketsuppia, hummusta, tzatzikia, tomaattia ja kurkkua.', 9.9, '', 'L,G');
add('kids_falafel_salad', 'children', 'Kids Falafel Salad', 'Lasten Falafel-salaatti', '3 falafel, hummus or tzatziki, house tomato sauce, fresh salad mix, tomato, cucumber and red cabbage.', '3 kpl falafelia, hummusta tai tzatzikia, talon tomaattikastiketta, tuoretta salaattisekoitusta, tomaattia, kurkkua ja punakaalia.', 8.9, '', 'L,V,K,G');

add('chicken_nuggets', 'sides', 'Chicken Nuggets (9 pcs)', 'Kananugetit (9 kpl)', '9 nuggets, ketchup and garlic or cucumber mayo dip.', '9 kpl nugetteja, ketsuppia sekä valkosipuli- tai kurkkumajoneesidippi.', 5.9, 8.9, '');
add('fish_chips', 'sides', 'Fish & Chips', 'Fish & Chips', 'Crispy fried cod fillet, lemon, fries, cucumber mayo and tartar sauce.', 'Rapeaksi friteerattua turskan seläkettä, sitruunaa, ranskalaisia sekä kurkkumajoneesia ja tartarkastiketta.', 10.9, 13.9, 'L');
add('fries', 'sides', 'French Fries', 'Ranskalaiset', 'Seasoned fries with chili mayo or cucumber mayo dip.', 'Maustetut ranskalaiset ja chilimajoneesi- tai kurkkumajoneesidippi.', 3.9, '', 'G,V');
add('sweet_potato_fries', 'sides', 'Sweet Potato Fries', 'Bataattiranskalaiset', 'Crispy sweet potato fries with tzatziki or cucumber mayo dip.', 'Rapeat bataattiranskalaiset ja tzatziki- tai kurkkumajoneesidippi.', 5.5, '', 'L,G');
add('halloumi_fries', 'sides', 'Halloumi Fries', 'Halloumiranskalaiset', 'Crispy halloumi fries with tzatziki dip.', 'Rapeat halloumiranskalaiset ja tzatzikidippi.', 6.5, '', 'L,G');
add('hummus_pide', 'sides', 'Hummus & Pide Bread', 'Hummus & Pide-leipä', 'House hummus with warm toasted pide bread.', 'Talon samettista hummusta ja lämmintä paahdettua pide-leipää.', 6.5, '', 'V,L');
add('falafel_hummus', 'sides', 'Falafel & Hummus', 'Falafelit & Hummus', '6 crispy falafel with hummus dip.', '6 kpl rapeita falafeleja ja hummusdippi.', 5.5, '', 'V,G');
add('cauliflower_broccoli_hummus', 'sides', 'Cauliflower / Broccoli & Hummus', 'Kukkakaali / Brokkoli & Hummus', 'Grilled cauliflower or broccoli with hummus dip.', 'Paistettua kukkakaalia tai parsakaalia ja hummusdippi.', 4.9, '', 'V,G');
add('steamed_rice', 'sides', 'Steamed Rice', 'Höyrytetty Riisi', '', '', 3.9, '', '');
add('loaded_fries', 'sides', 'Loaded Fries', 'Loaded Ranskalaiset', 'French fries, sweet potato fries and halloumi fries topped with chili, cucumber and garlic mayo, seasoned onion, roasted onion, fresh chili and feta.', 'Ranskalaisia, bataattiranskalaisia ja halloumiranskalaisia kuorrutettuna chili-, kurkku- ja valkosipulimajoneesilla, maustetulla sipulilla, paahdetulla sipulilla, tuoreella chilillä ja fetajuustolla.', 7.9, '', '');

add('soft_drinks', 'beverages', 'Soft Drinks (0.33 l)', 'Virvoitusjuomat (0,33 l)', 'Coca-Cola, Coca-Cola Zero, Jaffa Orange or 7Up Free.', 'Coca-Cola, Coca-Cola Zero, Jaffa Appelsiini tai 7Up Free.', 2.9, '', '');
add('vichy', 'beverages', 'Hartwall Vichy Original (0.5 l)', 'Hartwall Vichy Original (0,5 l)', '', '', 2.9, '', '');
add('jarritos', 'beverages', 'Jarritos (0.37 l)', 'Jarritos (0,37 l)', 'Guava, Mandarin, Mango or Grapefruit.', 'Guava, Mandarin, Mango tai Grapefruit.', 3.9, '', '');
add('juice_boxes', 'beverages', 'Juice Boxes', 'Mehupurkit', 'Strawberry, apple or orange.', 'Mansikka, omena tai appelsiini.', 1.5, '', '');

add('garlic_mayo', 'dips', 'Garlic Mayo', 'Valkosipulimajoneesi', '', '', 1.5, '', '');
add('chili_mayo', 'dips', 'Chili Mayo', 'Chilimajoneesi', '', '', 1.5, '', '');
add('curry_mayo', 'dips', 'Curry Mayo', 'Currymajoneesi', '', '', 1.5, '', '');
add('cucumber_mayo', 'dips', 'Cucumber Mayo', 'Kurkkumajoneesi', '', '', 1.5, '', '');
add('tzatziki', 'dips', 'Tzatziki', 'Tzatziki', '', '', 1.5, '', '');
add('hummus', 'dips', 'Hummus', 'Hummus', '', '', 1.5, '', '');
add('house_tomato_sauce', 'dips', 'House Tomato Sauce', 'Talon tomaattikastike', '', '', 1.5, '', '');
add('naga_chili_sauce', 'dips', 'Naga Chili Sauce', 'Naga-chilikastike', '', '', 1.5, '', '');

const halalItemIds = new Set([
  'chicken_doner', 'halloumi_chicken_doner', 'beef_doner', 'halloumi_beef_doner', 'mixed_doner',
  'be_the_chef_pita', 'chicken_mezze', 'beef_mezze', 'mixed_mezze',
  'doner_fries_bowl', 'doner_rice_bowl', 'doner_iskander_bowl', 'house_special_bowl',
  'be_the_chef_bowl', 'kids_doner_fries', 'chicken_nuggets'
]);

// Use the restaurant's preferred Finnish name wherever the menu says "fresh salad mix".
items.forEach(row => {
  row[5] = row[5].replaceAll('tuoretta salaattisekoitusta', 'tuoretta jäävuorisalaattisekoitusta');
  if (halalItemIds.has(row[0])) {
    row[16] = [...new Set([...String(row[16]).split(',').filter(Boolean), 'H'])].join(',');
  }
  const overriddenUrls = imageUrlOverrides.get(row[0]);
  const selectedNames = multiImageSelections.get(row[0]);
  const imageFiles = selectedNames
    ? selectedNames.flatMap(name => {
        const images = getProductImages(name);
        if (!images.length) throw new Error(`Missing configured product image: ${name}`);
        return images;
      })
    : getProductImages(row[3]).length
      ? getProductImages(row[3])
      : getProductImages(row[2]);
  row[19] = overriddenUrls
    ? overriddenUrls.join('|')
    : [...new Set(imageFiles)]
      .map(file => `assets/images/Items/${file}`)
      .join('|');
});

const optionGroups = [
  ['size_option', 'Order type', 'Tilaustapa', 'single', 1, 1],
  ['protein_option', 'Protein', 'Proteiini', 'single', 1, 1],
];
const options = [
  ['regular', 'size_option', 'Regular', 'Normaali', 0],
  ['meal', 'size_option', 'Meal (fries and Coke)', 'Ateria (ranskalaiset ja Coca-Cola)', 3],
  ['chicken', 'protein_option', 'Chicken döner', 'Kana-döner', 0],
  ['beef', 'protein_option', 'Beef döner', 'Nauta-döner', 1],
];
const specials = [];
const hours = [
  ['Mon', '11:00', '21:00', false], ['Tue', '11:00', '21:00', false],
  ['Wed', '11:00', '21:00', false], ['Thu', '11:00', '21:00', false],
  ['Fri', '11:00', '22:00', false], ['Sat', '12:00', '22:00', false],
  ['Sun', '12:00', '20:00', false],
];
const settings = [[
  'Spice Döner', 'Spice Döner', 'Premium kebab, hummus & falafel.', 'Premium kebab, hummus & falafel.',
  'View Menu', 'Katso menu', '/menu', 'https://wolt.com/fi/restaurant/spice-donor',
  '', '', 'info@spicedonor.fi',
  'Kauppakeskus Forum (food court)', 'Mannerheimintie 20', 'Helsinki', '00100',
  'https://maps.google.com/maps?q=Kauppakeskus+Forum,+Mannerheimintie+20,+00100+Helsinki&output=embed',
  'https://instagram.com/spicedonor', 'https://facebook.com/spicedonor', 'https://tiktok.com/@spicedonor',
  'EUR', '#D2691E', '#8B4513'
]];

const readme = [
  ['Purpose', 'This workbook is the single menu data source for the Spice Döner website.'],
  ['Update cycle', 'Save or replace the workbook at the same deployed URL. Open site sessions refresh within five minutes; a page reload also checks for changes.'],
  ['Items', 'Add, edit or remove rows on the items sheet. Keep id values unique and choose a category_id from the categories sheet.'],
  ['Visibility', 'Set available to TRUE/FALSE for items and visible to TRUE/FALSE for categories.'],
  ['Prices', 'Use numeric values in price fields. price_large is the meal price (regular price + €3, including fries and Coke). price_alt and price_alt_large support a second protein price line.'],
  ['Structure', 'Do not rename worksheet tabs or column headers. Empty optional sheets are allowed.'],
  ['Source', 'Menu content transcribed from SPICE DÖNER Menu.pdf (updated menu supplied by the restaurant).'],
];

const specs = [
  ['README', ['topic','guidance'], readme],
  ['items', ['id','category_id','name_en','name_fi','description_en','description_fi','price','price_large','price_alt','price_alt_large','price_label_en','price_label_fi','price_alt_label_en','price_alt_label_fi','discount_price','currency','dietary_tags','allergens','available','image_url','order_links','options_group_ids'], items],
  ['categories', ['id','name_en','name_fi','description_en','description_fi','sort_order','visible'], categories],
  ['option_groups', ['id','name_en','name_fi','selection_type','min_select','max_select'], optionGroups],
  ['options', ['id','group_id','name_en','name_fi','price_delta'], options],
  ['specials', ['id','title_en','title_fi','description_en','description_fi','price','discount_price','active','start_date','end_date'], specials],
  ['hours', ['day','open','close','closed'], hours],
  ['site_settings', ['hero_title_en','hero_title_fi','hero_subtitle_en','hero_subtitle_fi','cta_primary_text_en','cta_primary_text_fi','cta_primary_link','external_order_wolt_url','external_order_uber_eats_url','phone','email','address_line1','address_line2','city','postal_code','map_embed_url','instagram_url','facebook_url','tiktok_url','currency','brand_primary_color','brand_secondary_color'], settings],
];

const workbook = Workbook.create();
for (const [name, headers, rows] of specs) {
  const sheet = workbook.worksheets.add(name);
  sheet.showGridLines = false;
  sheet.getRangeByIndexes(0, 0, rows.length + 1, headers.length).values = [headers, ...rows];
  const used = sheet.getRangeByIndexes(0, 0, rows.length + 1, headers.length);
  used.format.font = { name: 'Arial', size: 10, color: '#222222' };
  const header = sheet.getRangeByIndexes(0, 0, 1, headers.length);
  header.format = { fill: '#2F5D3A', font: { name: 'Arial', size: 10, bold: true, color: '#FFFFFF' }, horizontalAlignment: 'center', verticalAlignment: 'center', wrapText: true };
  header.format.rowHeight = 32;
  used.format.autofitColumns();
  used.format.autofitRows();
  for (let col = 0; col < headers.length; col++) {
    const h = headers[col];
    const range = sheet.getRangeByIndexes(0, col, rows.length + 1, 1);
    if (h.includes('description')) range.format.columnWidth = 42;
    else if (h.includes('url') || h === 'order_links') range.format.columnWidth = 34;
    else if (h.includes('name') || h.includes('title')) range.format.columnWidth = 24;
    else range.format.columnWidth = Math.min(18, Math.max(11, h.length + 2));
    if (h.includes('description')) range.format.wrapText = true;
    if (['price','price_large','price_alt','price_alt_large','discount_price','price_delta'].includes(h)) {
      sheet.getRangeByIndexes(1, col, Math.max(rows.length, 1), 1).format.numberFormat = '€0.00';
    }
  }
  used.format.autofitRows();
  if (name === 'README') {
    sheet.getRange('A1:A8').format.columnWidth = 18;
    sheet.getRange('B1:B8').format.columnWidth = 90;
    sheet.getRange('B2:B8').format.wrapText = true;
    sheet.getRange('A1:B8').format.autofitRows();
  }
  sheet.freezePanes.freezeRows(1);
  if (rows.length) {
    const table = sheet.tables.add(sheet.getRangeByIndexes(0, 0, rows.length + 1, headers.length), true, `${name.replace(/_/g, '')}Table`);
    table.style = 'TableStyleMedium4';
  }
}

const itemsSheet = workbook.worksheets.getItem('items');
itemsSheet.getRange('B2:B250').dataValidation = { rule: { type: 'list', formula1: "categories!$A$2:$A$9" } };
itemsSheet.getRange('S2:S250').dataValidation = { rule: { type: 'list', values: ['TRUE', 'FALSE'] } };
const categoriesSheet = workbook.worksheets.getItem('categories');
categoriesSheet.getRange('G2:G100').dataValidation = { rule: { type: 'list', values: ['TRUE', 'FALSE'] } };

await fs.mkdir(new URL('../outputs/menu/', import.meta.url), { recursive: true });
workbook.recalculate();
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);

for (const [name] of specs) {
  const preview = await workbook.render({ sheetName: name, autoCrop: 'all', scale: 1, format: 'png' });
  await fs.writeFile(new URL(`../tmp/${name}.png`, import.meta.url), new Uint8Array(await preview.arrayBuffer()));
}

const keyInspect = await workbook.inspect({ kind: 'table', range: 'items!A1:V49', include: 'values,formulas', tableMaxRows: 8, tableMaxCols: 22, maxChars: 9000 });
console.log(keyInspect.ndjson);
const errors = await workbook.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!', options: { useRegex: true, maxResults: 300 }, summary: 'final formula error scan' });
console.log(errors.ndjson);
console.log(`Created ${outputPath} with ${items.length} menu items.`);
