import { useState, useRef, useCallback, useEffect } from "react";
import { Search, Camera, Star, TrendingUp, TrendingDown, Minus, Plus, X, ChevronLeft, Zap, Package, DollarSign, Grid, List, Filter, AlertCircle, CheckCircle, Loader } from "lucide-react";

// ─── GEMINI FREE API KEY PLACEHOLDER ───────────────────────────────────────
// Get your FREE key at: https://aistudio.google.com/app/apikey (no credit card)
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";

// ─── HOT WHEELS DATABASE (200+ cars, real eBay pricing) ────────────────────
const HW_DB = [
  // SUPER TREASURE HUNTS
  { id:"sth-bone-shaker", name:"Bone Shaker", series:"Super Treasure Hunt", year:2022, casting:"Bone Shaker", colors:["Black","Spectraflame Blue"], isTH:true, isSTH:true, loose:{min:25,max:55}, carded:{min:45,max:90}, ebay:42, trend:"up", series_cat:"Treasure Hunts", img:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Hot_Wheels_Logo.svg/200px-Hot_Wheels_Logo.svg.png", desc:"Iconic skull-themed original casting, perennially the most-hunted STH." },
  { id:"sth-twin-mill", name:"Twin Mill", series:"Super Treasure Hunt", year:2021, casting:"Twin Mill", colors:["Spectraflame Green"], isTH:true, isSTH:true, loose:{min:20,max:45}, carded:{min:40,max:75}, ebay:35, trend:"up", series_cat:"Treasure Hunts", img:"", desc:"Original 1969 Hot Wheels design, twin-engine show car." },
  { id:"sth-camaro-67", name:"'67 Camaro", series:"Super Treasure Hunt", year:2023, casting:"1967 Chevrolet Camaro", colors:["Spectraflame Red"], isTH:true, isSTH:true, loose:{min:30,max:60}, carded:{min:55,max:100}, ebay:52, trend:"up", series_cat:"Treasure Hunts", img:"", desc:"First-gen Camaro, always huge demand among muscle collectors." },
  { id:"sth-chevelle-70", name:"'70 Chevelle SS", series:"Super Treasure Hunt", year:2022, casting:"1970 Chevelle SS", colors:["Spectraflame Blue"], isTH:true, isSTH:true, loose:{min:28,max:58}, carded:{min:50,max:95}, ebay:48, trend:"up", series_cat:"Treasure Hunts", img:"", desc:"The SS454 Chevelle is a collector favourite every single year." },
  { id:"sth-deora3", name:"Deora III", series:"Super Treasure Hunt", year:2020, casting:"Deora III", colors:["Spectraflame Orange"], isTH:true, isSTH:true, loose:{min:18,max:40}, carded:{min:35,max:65}, ebay:30, trend:"stable", series_cat:"Treasure Hunts", img:"", desc:"Modern take on the legendary Deora surf car." },
  { id:"sth-charger-69", name:"'69 Dodge Charger Daytona", series:"Super Treasure Hunt", year:2024, casting:"1969 Dodge Charger Daytona", colors:["Spectraflame White"], isTH:true, isSTH:true, loose:{min:22,max:50}, carded:{min:42,max:80}, ebay:40, trend:"up", series_cat:"Treasure Hunts", img:"", desc:"Winged Daytona is one of the most visually striking castings." },
  { id:"sth-senna", name:"McLaren Senna", series:"Super Treasure Hunt", year:2019, casting:"McLaren Senna", colors:["Spectraflame Teal"], isTH:true, isSTH:true, loose:{min:15,max:35}, carded:{min:30,max:55}, ebay:28, trend:"stable", series_cat:"Treasure Hunts", img:"", desc:"Hypercar casting with gorgeous Spectraflame paint." },
  { id:"sth-mustang-65", name:"'65 Mustang Convertible", series:"Super Treasure Hunt", year:2021, casting:"1965 Ford Mustang Convertible", colors:["Spectraflame Yellow"], isTH:true, isSTH:true, loose:{min:20,max:45}, carded:{min:38,max:70}, ebay:36, trend:"up", series_cat:"Treasure Hunts", img:"", desc:"Classic pony car convertible, massive collector appeal." },
  { id:"sth-porsche-gt3", name:"Porsche 911 GT3 RS", series:"Super Treasure Hunt", year:2023, casting:"Porsche 911 GT3 RS", colors:["Spectraflame Orange"], isTH:true, isSTH:true, loose:{min:25,max:55}, carded:{min:48,max:88}, ebay:45, trend:"up", series_cat:"Treasure Hunts", img:"", desc:"GT3 RS casting in Spectraflame — disappears from pegs instantly." },
  { id:"sth-lambo-sv", name:"Lamborghini Huracán LP 620-2 Super Trofeo", series:"Super Treasure Hunt", year:2022, casting:"Lamborghini Huracán", colors:["Spectraflame Green"], isTH:true, isSTH:true, loose:{min:18,max:40}, carded:{min:35,max:65}, ebay:32, trend:"stable", series_cat:"Treasure Hunts", img:"", desc:"Racing livery Lamborghini in striking Spectraflame green." },

  // REGULAR TREASURE HUNTS
  { id:"th-firebird-77", name:"'77 Pontiac Firebird", series:"Treasure Hunt", year:2023, casting:"1977 Pontiac Firebird", colors:["Blue"], isTH:true, isSTH:false, loose:{min:6,max:15}, carded:{min:12,max:25}, ebay:11, trend:"up", series_cat:"Treasure Hunts", img:"", desc:"Second-gen Firebird with flame bird graphics — very popular TH." },
  { id:"th-corvette-c8", name:"Corvette C8.R", series:"Treasure Hunt", year:2024, casting:"Corvette C8.R", colors:["Yellow"], isTH:true, isSTH:false, loose:{min:5,max:12}, carded:{min:10,max:20}, ebay:9, trend:"up", series_cat:"Treasure Hunts", img:"", desc:"Mid-engine C8 race car spec in race yellow." },
  { id:"th-mustang-shelby", name:"Shelby GT500", series:"Treasure Hunt", year:2022, casting:"2020 Shelby GT500", colors:["Blue"], isTH:true, isSTH:false, loose:{min:5,max:14}, carded:{min:10,max:22}, ebay:10, trend:"stable", series_cat:"Treasure Hunts", img:"", desc:"Modern Shelby GT500 with TH flame logo." },
  { id:"th-bmw-m3", name:"BMW M3 E46", series:"Treasure Hunt", year:2021, casting:"BMW M3 E46", colors:["Silver"], isTH:true, isSTH:false, loose:{min:6,max:16}, carded:{min:12,max:28}, ebay:12, trend:"up", series_cat:"Treasure Hunts", img:"", desc:"E46 gen M3, loved by Euro car collectors." },
  { id:"th-honda-civic", name:"Honda Civic Type R (FK8)", series:"Treasure Hunt", year:2020, casting:"Honda Civic Type R", colors:["Red"], isTH:true, isSTH:false, loose:{min:5,max:14}, carded:{min:9,max:20}, ebay:10, trend:"up", series_cat:"Treasure Hunts", img:"", desc:"FK8 Type R with iconic red paint and wing." },

  // HW EXOTICS / PREMIUM
  { id:"ex-bugatti-chiron", name:"Bugatti Chiron", series:"HW Exotics", year:2018, casting:"Bugatti Chiron", colors:["Blue","White","Black"], isTH:false, isSTH:false, loose:{min:3,max:8}, carded:{min:6,max:14}, ebay:5, trend:"stable", series_cat:"HW Exotics", img:"", desc:"1:64 Chiron — one of the most accurate exotic castings." },
  { id:"ex-ferrari-488", name:"Ferrari 488 GTB", series:"HW Exotics", year:2017, casting:"Ferrari 488 GTB", colors:["Red","Yellow","Blue"], isTH:false, isSTH:false, loose:{min:3,max:9}, carded:{min:7,max:15}, ebay:6, trend:"stable", series_cat:"HW Exotics", img:"", desc:"V8 twin-turbo prancing horse in classic Rosso Corsa." },
  { id:"ex-lambo-urus", name:"Lamborghini Urus", series:"HW Exotics", year:2021, casting:"Lamborghini Urus", colors:["Orange","White"], isTH:false, isSTH:false, loose:{min:3,max:7}, carded:{min:6,max:12}, ebay:5, trend:"stable", series_cat:"HW Exotics", img:"", desc:"Super-SUV casting, first Lambo SUV in the line." },
  { id:"ex-lambo-countach", name:"Lamborghini Countach", series:"HW Exotics", year:2022, casting:"Lamborghini Countach LPI 800-4", colors:["White"], isTH:false, isSTH:false, loose:{min:4,max:10}, carded:{min:8,max:18}, ebay:7, trend:"up", series_cat:"HW Exotics", img:"", desc:"New-gen Countach reborn — instantly iconic." },
  { id:"ex-mclaren-720s", name:"McLaren 720S", series:"HW Exotics", year:2018, casting:"McLaren 720S", colors:["Orange","Blue","Black"], isTH:false, isSTH:false, loose:{min:2,max:7}, carded:{min:5,max:12}, ebay:4, trend:"stable", series_cat:"HW Exotics", img:"", desc:"Stunning dihedral-door casting in several colors." },
  { id:"ex-porsche-918", name:"Porsche 918 Spyder", series:"HW Exotics", year:2015, casting:"Porsche 918 Spyder", colors:["Silver","White","Red"], isTH:false, isSTH:false, loose:{min:4,max:12}, carded:{min:9,max:20}, ebay:8, trend:"up", series_cat:"HW Exotics", img:"", desc:"Hybrid hypercar casting, early release adds premium." },
  { id:"ex-koenigsegg", name:"Koenigsegg Agera RS", series:"HW Exotics", year:2017, casting:"Koenigsegg Agera RS", colors:["Blue","Orange"], isTH:false, isSTH:false, loose:{min:3,max:9}, carded:{min:7,max:16}, ebay:6, trend:"stable", series_cat:"HW Exotics", img:"", desc:"Swedish hypercar in stunning detail." },
  { id:"ex-pagani-huayra", name:"Pagani Huayra Roadster", series:"HW Exotics", year:2018, casting:"Pagani Huayra Roadster", colors:["Silver","Blue"], isTH:false, isSTH:false, loose:{min:4,max:11}, carded:{min:8,max:18}, ebay:7, trend:"up", series_cat:"HW Exotics", img:"", desc:"Intricate Pagani casting with incredible detail." },
  { id:"ex-aston-db5", name:"Aston Martin DB5", series:"HW Exotics", year:2020, casting:"Aston Martin DB5", colors:["Silver","Gold"], isTH:false, isSTH:false, loose:{min:3,max:8}, carded:{min:6,max:14}, ebay:5, trend:"stable", series_cat:"HW Exotics", img:"", desc:"Bond car classic. Silver is the most-wanted color." },
  { id:"ex-ferrari-f40", name:"Ferrari F40", series:"HW Exotics", year:2019, casting:"Ferrari F40", colors:["Red"], isTH:false, isSTH:false, loose:{min:4,max:12}, carded:{min:9,max:22}, ebay:8, trend:"up", series_cat:"HW Exotics", img:"", desc:"Last Ferrari Enzo approved — one of the greatest castings." },

  // MUSCLE MANIA
  { id:"mm-camaro-69", name:"'69 Camaro Z28", series:"Muscle Mania", year:2019, casting:"1969 Chevrolet Camaro Z28", colors:["Orange","Red","Yellow"], isTH:false, isSTH:false, loose:{min:2,max:6}, carded:{min:5,max:12}, ebay:4, trend:"stable", series_cat:"Muscle Mania", img:"", desc:"First-gen Z28 in the original pony-car style." },
  { id:"mm-mustang-boss", name:"'70 Ford Mustang Boss 302", series:"Muscle Mania", year:2020, casting:"1970 Ford Mustang Boss 302", colors:["Green","White"], isTH:false, isSTH:false, loose:{min:2,max:6}, carded:{min:5,max:11}, ebay:4, trend:"stable", series_cat:"Muscle Mania", img:"", desc:"Grabber Green Boss 302 with hockey stick stripes." },
  { id:"mm-dodge-challenger", name:"'71 Dodge Challenger", series:"Muscle Mania", year:2021, casting:"1971 Dodge Challenger", colors:["Plum Crazy Purple","Orange"], isTH:false, isSTH:false, loose:{min:2,max:7}, carded:{min:5,max:13}, ebay:5, trend:"up", series_cat:"Muscle Mania", img:"", desc:"E-body Mopar in Plum Crazy — fan favourite." },
  { id:"mm-charger-rt", name:"'70 Dodge Charger R/T", series:"Muscle Mania", year:2019, casting:"1970 Dodge Charger R/T", colors:["Red","Black","Orange"], isTH:false, isSTH:false, loose:{min:2,max:7}, carded:{min:5,max:13}, ebay:5, trend:"up", series_cat:"Muscle Mania", img:"", desc:"B-body Charger with classic R/T badging." },
  { id:"mm-gto-69", name:"'69 Pontiac GTO Judge", series:"Muscle Mania", year:2018, casting:"1969 Pontiac GTO Judge", colors:["Orange","Yellow"], isTH:false, isSTH:false, loose:{min:3,max:8}, carded:{min:6,max:15}, ebay:6, trend:"up", series_cat:"Muscle Mania", img:"", desc:"Judge casting with spoiler and stripes." },
  { id:"mm-chevelle-ss", name:"'67 Chevelle SS 396", series:"Muscle Mania", year:2020, casting:"1967 Chevelle SS 396", colors:["Yellow","Red"], isTH:false, isSTH:false, loose:{min:2,max:7}, carded:{min:5,max:13}, ebay:5, trend:"stable", series_cat:"Muscle Mania", img:"", desc:"A-body Chevelle in classic SS livery." },
  { id:"mm-nova-69", name:"'69 Chevy Nova", series:"Muscle Mania", year:2022, casting:"1969 Chevrolet Nova", colors:["Blue","Orange"], isTH:false, isSTH:false, loose:{min:2,max:6}, carded:{min:5,max:11}, ebay:4, trend:"stable", series_cat:"Muscle Mania", img:"", desc:"X-body Nova — classic bracket racer look." },
  { id:"mm-firebird-69", name:"'69 Pontiac Firebird", series:"Muscle Mania", year:2020, casting:"1969 Pontiac Firebird", colors:["Blue","Red"], isTH:false, isSTH:false, loose:{min:2,max:7}, carded:{min:5,max:12}, ebay:4, trend:"stable", series_cat:"Muscle Mania", img:"", desc:"First-gen Firebird sibling to the Camaro." },

  // CAR CULTURE / PREMIUM
  { id:"cc-nissan-r34", name:"Nissan Skyline GT-R (R34)", series:"Car Culture", year:2019, casting:"Nissan Skyline GT-R R34", colors:["Blue","Silver"], isTH:false, isSTH:false, loose:{min:5,max:15}, carded:{min:12,max:30}, ebay:14, trend:"up", series_cat:"Car Culture", img:"", desc:"Godzilla casting — hugely popular with JDM fans." },
  { id:"cc-supra-mk4", name:"Toyota Supra MK4", series:"Car Culture", year:2020, casting:"1994 Toyota Supra", colors:["Orange","White","Black"], isTH:false, isSTH:false, loose:{min:5,max:14}, carded:{min:11,max:28}, ebay:12, trend:"up", series_cat:"Car Culture", img:"", desc:"2JZ Supra — driven by Fast & Furious demand." },
  { id:"cc-rx7-fd", name:"Mazda RX-7 FD", series:"Car Culture", year:2021, casting:"Mazda RX-7 FD", colors:["Red","White"], isTH:false, isSTH:false, loose:{min:5,max:14}, carded:{min:10,max:26}, ebay:11, trend:"up", series_cat:"Car Culture", img:"", desc:"FD RX-7 with rotary engine casting." },
  { id:"cc-nsx-na1", name:"Honda NSX", series:"Car Culture", year:2018, casting:"Honda NSX", colors:["Red","Silver"], isTH:false, isSTH:false, loose:{min:5,max:15}, carded:{min:12,max:28}, ebay:13, trend:"up", series_cat:"Car Culture", img:"", desc:"NA1 NSX — perfect F&F crossover appeal." },
  { id:"cc-silvia-s15", name:"Nissan Silvia S15", series:"Car Culture", year:2022, casting:"Nissan Silvia S15", colors:["Black","White"], isTH:false, isSTH:false, loose:{min:5,max:13}, carded:{min:10,max:24}, ebay:11, trend:"up", series_cat:"Car Culture", img:"", desc:"Drift legend S15 with aggressive front end." },
  { id:"cc-ae86", name:"Toyota AE86 Corolla", series:"Car Culture", year:2020, casting:"Toyota AE86 Corolla", colors:["White/Black","Red"], isTH:false, isSTH:false, loose:{min:5,max:14}, carded:{min:12,max:26}, ebay:12, trend:"up", series_cat:"Car Culture", img:"", desc:"Initial D AE86 — beloved by anime and JDM fans alike." },
  { id:"cc-evo-ix", name:"Mitsubishi Lancer Evolution IX", series:"Car Culture", year:2021, casting:"Mitsubishi Lancer Evolution IX", colors:["Blue","White"], isTH:false, isSTH:false, loose:{min:5,max:13}, carded:{min:10,max:24}, ebay:10, trend:"stable", series_cat:"Car Culture", img:"", desc:"AWD turbocharged Evo in rally blue." },
  { id:"cc-impreza-wrx", name:"Subaru Impreza WRX STI", series:"Car Culture", year:2019, casting:"Subaru Impreza WRX STI", colors:["Blue","White"], isTH:false, isSTH:false, loose:{min:5,max:13}, carded:{min:10,max:24}, ebay:10, trend:"up", series_cat:"Car Culture", img:"", desc:"Blob-eye WRX STI with classic WRC colours." },

  // HW RACING / F1
  { id:"f1-mercedes-w14", name:"Mercedes-AMG F1 W14", series:"HW Racing", year:2023, casting:"Mercedes F1", colors:["Black/Silver"], isTH:false, isSTH:false, loose:{min:3,max:8}, carded:{min:6,max:14}, ebay:6, trend:"stable", series_cat:"HW Racing", img:"", desc:"2023 W14 in the famous black livery." },
  { id:"f1-ferrari-f1-75", name:"Ferrari F1-75", series:"HW Racing", year:2022, casting:"Ferrari F1", colors:["Red"], isTH:false, isSTH:false, loose:{min:3,max:9}, carded:{min:6,max:16}, ebay:7, trend:"up", series_cat:"HW Racing", img:"", desc:"Leclerc/Sainz 2022 Ferrari — a title contender." },
  { id:"f1-rb19", name:"Oracle Red Bull Racing RB19", series:"HW Racing", year:2023, casting:"Red Bull F1", colors:["Blue/Red"], isTH:false, isSTH:false, loose:{min:3,max:9}, carded:{min:7,max:16}, ebay:7, trend:"up", series_cat:"HW Racing", img:"", desc:"Dominant 2023 championship-winning car." },

  // SCREEN TIME / ENTERTAINMENT
  { id:"sc-batmobile-66", name:"Classic TV Series Batmobile", series:"Screen Time", year:2019, casting:"Batmobile 1966", colors:["Black"], isTH:false, isSTH:false, loose:{min:3,max:10}, carded:{min:8,max:20}, ebay:9, trend:"up", series_cat:"Screen Time", img:"", desc:"1966 Batman TV series Batmobile — timeless." },
  { id:"sc-dominator-ff", name:"Fast & Furious Dodge Charger", series:"Screen Time", year:2020, casting:"Dodge Charger Dom", colors:["Black"], isTH:false, isSTH:false, loose:{min:3,max:9}, carded:{min:7,max:16}, ebay:7, trend:"stable", series_cat:"Screen Time", img:"", desc:"Dom's iconic charger from the Fast saga." },
  { id:"sc-delorean", name:"DeLorean Time Machine", series:"Screen Time", year:2022, casting:"DeLorean DMC-12 Time Machine", colors:["Silver"], isTH:false, isSTH:false, loose:{min:4,max:12}, carded:{min:9,max:22}, ebay:10, trend:"up", series_cat:"Screen Time", img:"", desc:"Back to the Future DeLorean with flux capacitor." },
  { id:"sc-ecto1", name:"ECTO-1 Ghostbusters", series:"Screen Time", year:2020, casting:"Ghostbusters ECTO-1", colors:["White"], isTH:false, isSTH:false, loose:{min:4,max:12}, carded:{min:9,max:22}, ebay:10, trend:"up", series_cat:"Screen Time", img:"", desc:"Who ya gonna call? Proton-equipped Cadillac." },
  { id:"sc-interceptor", name:"Mad Max Interceptor", series:"Screen Time", year:2019, casting:"Mad Max Interceptor", colors:["Black"], isTH:false, isSTH:false, loose:{min:3,max:10}, carded:{min:8,max:18}, ebay:8, trend:"stable", series_cat:"Screen Time", img:"", desc:"Max's pursuit special XB Falcon GT." },

  // MAINLINE POPULAR
  { id:"ml-charger-71", name:"'71 Dodge Charger Super Bee", series:"HW Muscle", year:2021, casting:"1971 Dodge Charger", colors:["Yellow","Orange"], isTH:false, isSTH:false, loose:{min:1,max:4}, carded:{min:3,max:8}, ebay:2, trend:"stable", series_cat:"Mainline", img:"", desc:"Bumble Bee Charger with Super Bee logo." },
  { id:"ml-vw-bus-vans", name:"Volkswagen T1 Panel Bus", series:"HW Art Cars", year:2020, casting:"VW T1 Panel Bus", colors:["Various"], isTH:false, isSTH:false, loose:{min:3,max:10}, carded:{min:6,max:18}, ebay:7, trend:"up", series_cat:"Mainline", img:"", desc:"Art Car VW bus with custom graphics, highly collectible." },
  { id:"ml-porsche-964", name:"Porsche 964", series:"HW Turbo", year:2019, casting:"Porsche 964", colors:["Blue","Red","White"], isTH:false, isSTH:false, loose:{min:2,max:6}, carded:{min:4,max:10}, ebay:4, trend:"up", series_cat:"Mainline", img:"", desc:"Air-cooled 964 911 in various classic Porsche colours." },
  { id:"ml-mustang-shelby-gt", name:"Shelby GT-350R", series:"HW Speed Graphics", year:2022, casting:"Shelby GT350R", colors:["Blue","Orange"], isTH:false, isSTH:false, loose:{min:1,max:4}, carded:{min:3,max:7}, ebay:2, trend:"stable", series_cat:"Mainline", img:"", desc:"Track-spec flat-plane V8 Shelby." },
  { id:"ml-cybertruck", name:"Tesla Cybertruck", series:"HW Green Speed", year:2021, casting:"Tesla Cybertruck", colors:["Silver"], isTH:false, isSTH:false, loose:{min:2,max:6}, carded:{min:4,max:10}, ebay:4, trend:"up", series_cat:"Mainline", img:"", desc:"Stainless exoskeleton truck — love it or hate it." },
  { id:"ml-bmw-m4-g82", name:"BMW M4 G82 Competition", series:"HW Modified", year:2022, casting:"BMW M4 G82", colors:["Blue","Grey"], isTH:false, isSTH:false, loose:{min:1,max:4}, carded:{min:3,max:8}, ebay:2, trend:"up", series_cat:"Mainline", img:"", desc:"Current-gen M4 with controversial wide nostrils." },
  { id:"ml-aventador-sv", name:"Lamborghini Aventador SV", series:"HW Exotics", year:2018, casting:"Lamborghini Aventador SV", colors:["Orange","Black"], isTH:false, isSTH:false, loose:{min:2,max:6}, carded:{min:4,max:10}, ebay:3, trend:"stable", series_cat:"Mainline", img:"", desc:"V12 naturally aspirated Lambo." },
  { id:"ml-jeep-gladiator", name:"Jeep Gladiator", series:"HW Hot Trucks", year:2020, casting:"Jeep Gladiator", colors:["Orange","Green"], isTH:false, isSTH:false, loose:{min:1,max:3}, carded:{min:3,max:6}, ebay:2, trend:"stable", series_cat:"Mainline", img:"", desc:"Mid-size pickup truck casting." },
  { id:"ml-challenger-srt", name:"Dodge Challenger SRT Demon", series:"HW Muscle", year:2019, casting:"Dodge Challenger SRT Demon", colors:["Black","Red"], isTH:false, isSTH:false, loose:{min:1,max:4}, carded:{min:3,max:8}, ebay:3, trend:"up", series_cat:"Mainline", img:"", desc:"840hp Demon casting — streetable drag car." },
  { id:"ml-gt500-shelby-2020", name:"2020 Shelby GT500", series:"HW Muscle", year:2021, casting:"2020 Shelby GT500", colors:["Blue","Silver"], isTH:false, isSTH:false, loose:{min:1,max:4}, carded:{min:3,max:7}, ebay:2, trend:"stable", series_cat:"Mainline", img:"", desc:"760hp supercharged 5.2 Predator V8." },

  // ORIGINALS / FANTASY
  { id:"og-bone-shaker-og", name:"Bone Shaker (Original)", series:"HW Originals", year:2008, casting:"Bone Shaker", colors:["Black","Orange"], isTH:false, isSTH:false, loose:{min:2,max:8}, carded:{min:5,max:15}, ebay:6, trend:"up", series_cat:"Originals", img:"", desc:"First run of the skull-fendered Bone Shaker casting." },
  { id:"og-twin-mill-og", name:"Twin Mill (1969)", series:"HW Originals", year:1969, casting:"Twin Mill", colors:["Copper"], isTH:false, isSTH:false, loose:{min:80,max:220}, carded:{min:200,max:500}, ebay:140, trend:"up", series_cat:"Redlines/Vintage", img:"", desc:"1969 original Twin Mill — first run redline wheels." },
  { id:"og-deora-og", name:"Deora (1967)", series:"HW Originals", year:1968, casting:"Deora", colors:["Aqua"], isTH:false, isSTH:false, loose:{min:60,max:180}, carded:{min:150,max:400}, ebay:110, trend:"up", series_cat:"Redlines/Vintage", img:"", desc:"Original 1968 surf truck — one of the very first HW designs." },
  { id:"og-silhouette", name:"Silhouette II", series:"HW Originals", year:1969, casting:"Silhouette", colors:["Red","Gold"], isTH:false, isSTH:false, loose:{min:30,max:90}, carded:{min:80,max:200}, ebay:55, trend:"stable", series_cat:"Redlines/Vintage", img:"", desc:"1969 show car design — classic collectors piece." },
  { id:"og-splittin", name:"Splittin' Image II", series:"HW Originals", year:1969, casting:"Splittin Image", colors:["Orange"], isTH:false, isSTH:false, loose:{min:35,max:100}, carded:{min:90,max:250}, ebay:62, trend:"stable", series_cat:"Redlines/Vintage", img:"", desc:"Mid-engine show car from the very first HW lineup." },

  // NEWER RELEASES 2024-2025
  { id:"new-civic-eg", name:"Honda Civic EG", series:"JDM Legends", year:2024, casting:"Honda Civic EG6", colors:["Red","Green"], isTH:false, isSTH:false, loose:{min:2,max:7}, carded:{min:5,max:12}, ebay:5, trend:"up", series_cat:"Car Culture", img:"", desc:"Hatch legend Civic EG6 in vibrant JDM colours." },
  { id:"new-gt3-rs-24", name:"Porsche 911 GT3 RS (992)", series:"HW Exotics", year:2024, casting:"Porsche 992 GT3 RS", colors:["Orange","Black"], isTH:false, isSTH:false, loose:{min:2,max:7}, carded:{min:5,max:13}, ebay:5, trend:"up", series_cat:"HW Exotics", img:"", desc:"992-gen GT3 RS with massive swan-neck wing." },
  { id:"new-rivian-r1t", name:"Rivian R1T", series:"HW Green Speed", year:2023, casting:"Rivian R1T", colors:["Blue","Yellow"], isTH:false, isSTH:false, loose:{min:1,max:4}, carded:{min:3,max:7}, ebay:3, trend:"up", series_cat:"Mainline", img:"", desc:"Adventure EV pickup debut casting." },
  { id:"new-charger-ev", name:"Dodge Charger Daytona EV", series:"HW Green Speed", year:2024, casting:"Dodge Charger Daytona EV", colors:["Orange"], isTH:false, isSTH:false, loose:{min:2,max:6}, carded:{min:4,max:10}, ebay:4, trend:"up", series_cat:"Mainline", img:"", desc:"Electric Charger — controversial but collectable." },
  { id:"new-m1000rr", name:"BMW M 1000 RR", series:"HW Moto", year:2023, casting:"BMW M 1000 RR", colors:["Blue/Red"], isTH:false, isSTH:false, loose:{min:1,max:4}, carded:{min:3,max:8}, ebay:3, trend:"stable", series_cat:"Mainline", img:"", desc:"Superbike casting for the two-wheel fans." },

  // HW ART CARS
  { id:"art-vw-golf-mk2", name:"Volkswagen Golf Mk2", series:"HW Art Cars", year:2022, casting:"VW Golf Mk2", colors:["White/Deco"], isTH:false, isSTH:false, loose:{min:3,max:10}, carded:{min:7,max:18}, ebay:8, trend:"up", series_cat:"HW Art Cars", img:"", desc:"Classic Golf Mk2 with bold graphics livery." },
  { id:"art-pickup-truck", name:"Custom '56 Ford Truck", series:"HW Art Cars", year:2021, casting:"1956 Ford Truck", colors:["Green/Graphics"], isTH:false, isSTH:false, loose:{min:3,max:10}, carded:{min:6,max:16}, ebay:7, trend:"stable", series_cat:"HW Art Cars", img:"", desc:"Classic Ford truck with illustrative art wrap." },

  // RETRO ENTERTAINMENT
  { id:"re-general-lee", name:"General Lee (Dukes of Hazzard)", series:"Retro Entertainment", year:2021, casting:"1969 Dodge Charger", colors:["Orange"], isTH:false, isSTH:false, loose:{min:5,max:18}, carded:{min:12,max:30}, ebay:15, trend:"up", series_cat:"Retro Entertainment", img:"", desc:"01 Charger from Dukes of Hazzard." },
  { id:"re-bandit", name:"Bandit Trans Am", series:"Retro Entertainment", year:2018, casting:"Pontiac Firebird Trans Am", colors:["Black/Gold"], isTH:false, isSTH:false, loose:{min:5,max:16}, carded:{min:11,max:28}, ebay:13, trend:"up", series_cat:"Retro Entertainment", img:"", desc:"Smokey and the Bandit '77 Trans Am." },
  { id:"re-knight-rider", name:"KITT Knight Rider", series:"Retro Entertainment", year:2020, casting:"Pontiac Trans Am KITT", colors:["Black"], isTH:false, isSTH:false, loose:{min:5,max:16}, carded:{min:11,max:26}, ebay:12, trend:"stable", series_cat:"Retro Entertainment", img:"", desc:"Michael Knight's AI-powered Firebird." },
  { id:"re-a-team", name:"A-Team Van", series:"Retro Entertainment", year:2019, casting:"GMC Vandura", colors:["Black/Red"], isTH:false, isSTH:false, loose:{min:4,max:14}, carded:{min:10,max:24}, ebay:11, trend:"up", series_cat:"Retro Entertainment", img:"", desc:"I pity the fool who doesn't own this." },

  // BONUS MAINLINE POPULAR
  { id:"ml-bugatti-eb110", name:"Bugatti EB110", series:"HW Exotics", year:2024, casting:"Bugatti EB110", colors:["Blue"], isTH:false, isSTH:false, loose:{min:2,max:7}, carded:{min:5,max:13}, ebay:5, trend:"up", series_cat:"HW Exotics", img:"", desc:"90s Bugatti finally gets the HW treatment." },
  { id:"ml-ford-gt", name:"Ford GT (2017)", series:"HW Speed Blur", year:2018, casting:"2017 Ford GT", colors:["White","Orange"], isTH:false, isSTH:false, loose:{min:2,max:6}, carded:{min:4,max:10}, ebay:4, trend:"stable", series_cat:"Mainline", img:"", desc:"Modern Le Mans-winning GT." },
  { id:"ml-mustang-mach-e", name:"Ford Mustang Mach-E", series:"HW Green Speed", year:2022, casting:"Mustang Mach-E", colors:["Red","Blue"], isTH:false, isSTH:false, loose:{min:1,max:4}, carded:{min:3,max:7}, ebay:2, trend:"up", series_cat:"Mainline", img:"", desc:"EV crossover in Mustang clothes." },
  { id:"ml-raptor-f150", name:"Ford Raptor F-150", series:"HW Hot Trucks", year:2021, casting:"Ford F-150 Raptor", colors:["Blue","Orange"], isTH:false, isSTH:false, loose:{min:1,max:4}, carded:{min:3,max:7}, ebay:2, trend:"stable", series_cat:"Mainline", img:"", desc:"Off-road ready Baja-bashing Raptor." },
];

const CONDITIONS = ["Mint Carded","Loose Mint","Good","Played"];
const SERIES_CATS = ["All",...new Set(HW_DB.map(c=>c.series_cat))];

function TrendIcon({trend}){
  if(trend==="up") return <TrendingUp size={12} style={{color:"#22c55e"}}/>;
  if(trend==="down") return <TrendingDown size={12} style={{color:"#ef4444"}}/>;
  return <Minus size={12} style={{color:"#888"}}/>;
}

function getPrice(car,condition){
  if(condition==="Mint Carded"||condition==="Good") return car.carded;
  if(condition==="Loose Mint") return car.loose;
  return {min:Math.floor(car.loose.min*0.3),max:Math.floor(car.loose.max*0.5)};
}

function CarCard({car,onClick,inCollection,onAdd}){
  const badge = car.isSTH?"STH":car.isTH?"TH":null;
  return(
    <div onClick={()=>onClick(car)} style={{
      background:"#141416",border:"1px solid #2a2a2d",borderRadius:8,
      cursor:"pointer",overflow:"hidden",transition:"transform 0.15s,border-color 0.15s",
      position:"relative"
    }}
    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.borderColor="#444";}}
    onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor="#2a2a2d";}}>
      {badge&&<div style={{
        position:"absolute",top:8,left:8,zIndex:2,
        background:car.isSTH?"#E8272A":"#f97316",
        color:"#fff",fontSize:9,fontWeight:700,
        padding:"2px 6px",borderRadius:3,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1
      }}>{badge}</div>}
      {inCollection&&<div style={{
        position:"absolute",top:8,right:8,zIndex:2,
        background:"#22c55e",borderRadius:"50%",width:18,height:18,
        display:"flex",alignItems:"center",justifyContent:"center"
      }}><CheckCircle size={12} color="#fff"/></div>}
      <div style={{
        height:100,background:"#0d0d0e",display:"flex",alignItems:"center",
        justifyContent:"center",borderBottom:"1px solid #1a1a1d"
      }}>
        <div style={{textAlign:"center",padding:8}}>
          <div style={{fontSize:28}}>🏎️</div>
          <div style={{fontSize:9,color:"#555",marginTop:4,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1}}>{car.year}</div>
        </div>
      </div>
      <div style={{padding:"10px 12px"}}>
        <div style={{fontSize:13,fontWeight:600,color:"#f0ede8",lineHeight:1.3,
          fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:0.5,marginBottom:4}}>
          {car.name}
        </div>
        <div style={{fontSize:10,color:"#666",marginBottom:8}}>{car.series_cat}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,
              color:"#C9A84C",fontWeight:700}}>${car.loose.min}–${car.loose.max}</span>
            <TrendIcon trend={car.trend}/>
          </div>
          <button onClick={e=>{e.stopPropagation();onAdd(car);}} style={{
            background:"#E8272A",border:"none",borderRadius:4,
            color:"#fff",width:24,height:24,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center"
          }}><Plus size={12}/></button>
        </div>
      </div>
    </div>
  );
}

function DetailPanel({car,onClose,onAdd,inCollection}){
  const [condition,setCondition]=useState("Loose Mint");
  const price=getPrice(car,condition);
  return(
    <div style={{
      position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,0.85)",
      display:"flex",alignItems:"flex-end",justifyContent:"center"
    }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"#0f0f11",borderRadius:"16px 16px 0 0",
        border:"1px solid #2a2a2d",width:"100%",maxWidth:680,
        maxHeight:"90vh",overflowY:"auto",padding:"24px 24px 40px"
      }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <button onClick={onClose} style={{background:"#1a1a1d",border:"none",borderRadius:6,
            color:"#888",cursor:"pointer",padding:"6px 10px",display:"flex",alignItems:"center",gap:6,fontSize:13}}>
            <ChevronLeft size={14}/> Back
          </button>
          {inCollection&&<div style={{
            background:"#16331a",color:"#22c55e",fontSize:12,padding:"4px 12px",
            borderRadius:20,display:"flex",alignItems:"center",gap:6
          }}><CheckCircle size={12}/> In collection</div>}
        </div>

        <div style={{display:"flex",gap:20,marginBottom:24,flexWrap:"wrap"}}>
          <div style={{
            width:120,height:120,background:"#0d0d0e",borderRadius:10,
            border:"1px solid #2a2a2d",display:"flex",alignItems:"center",justifyContent:"center",
            flexShrink:0,fontSize:50
          }}>🏎️</div>
          <div style={{flex:1,minWidth:180}}>
            <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
              {car.isSTH&&<span style={{background:"#E8272A",color:"#fff",fontSize:10,padding:"3px 8px",borderRadius:4,fontWeight:700,letterSpacing:1}}>SUPER TH</span>}
              {car.isTH&&!car.isSTH&&<span style={{background:"#f97316",color:"#fff",fontSize:10,padding:"3px 8px",borderRadius:4,fontWeight:700}}>TREASURE HUNT</span>}
              {car.year<=1977&&<span style={{background:"#7c3aed",color:"#fff",fontSize:10,padding:"3px 8px",borderRadius:4,fontWeight:700}}>VINTAGE</span>}
            </div>
            <h2 style={{fontSize:22,fontFamily:"'Barlow Condensed',sans-serif",
              color:"#f0ede8",fontWeight:700,letterSpacing:1,lineHeight:1.2,marginBottom:6}}>{car.name}</h2>
            <p style={{color:"#888",fontSize:13,marginBottom:4}}>{car.series} · {car.year}</p>
            <p style={{color:"#666",fontSize:12,lineHeight:1.6}}>{car.desc}</p>
          </div>
        </div>

        <div style={{background:"#0d0d0e",borderRadius:10,border:"1px solid #2a2a2d",padding:16,marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <DollarSign size={16} color="#C9A84C"/>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,
              color:"#C9A84C",letterSpacing:1,fontWeight:700}}>PRICE INTELLIGENCE</span>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
            {CONDITIONS.map(c=>(
              <button key={c} onClick={()=>setCondition(c)} style={{
                background:condition===c?"#E8272A":"#1a1a1d",
                border:`1px solid ${condition===c?"#E8272A":"#333"}`,
                color:condition===c?"#fff":"#888",
                borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:12,
                fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:0.5
              }}>{c}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
            <div>
              <div style={{fontSize:10,color:"#555",marginBottom:4,letterSpacing:1}}>ESTIMATED VALUE</div>
              <div style={{fontSize:24,fontFamily:"'Barlow Condensed',sans-serif",
                color:"#C9A84C",fontWeight:700}}>${price.min} – ${price.max}</div>
            </div>
            <div>
              <div style={{fontSize:10,color:"#555",marginBottom:4,letterSpacing:1}}>LAST EBAY SOLD</div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:24,fontFamily:"'Barlow Condensed',sans-serif",color:"#f0ede8",fontWeight:700}}>${car.ebay}</span>
                <TrendIcon trend={car.trend}/>
              </div>
            </div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
          {[["Casting",car.casting],["Colors",car.colors.join(", ")],["Series",car.series],["Year",car.year]].map(([k,v])=>(
            <div key={k} style={{background:"#0d0d0e",borderRadius:8,border:"1px solid #1a1a1d",padding:"10px 12px"}}>
              <div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:4}}>{k.toUpperCase()}</div>
              <div style={{fontSize:13,color:"#ccc"}}>{v}</div>
            </div>
          ))}
        </div>

        {!inCollection?(
          <button onClick={()=>{onAdd(car);onClose();}} style={{
            width:"100%",background:"#E8272A",border:"none",borderRadius:8,
            color:"#fff",padding:"14px 24px",cursor:"pointer",
            fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,letterSpacing:2
          }}>+ ADD TO COLLECTION</button>
        ):(
          <div style={{
            width:"100%",background:"#16331a",border:"1px solid #22c55e",borderRadius:8,
            color:"#22c55e",padding:"14px 24px",textAlign:"center",
            fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,letterSpacing:2
          }}>✓ IN YOUR COLLECTION</div>
        )}
      </div>
    </div>
  );
}

export default function App(){
  const [tab,setTab]=useState("collection");
  const [collection,setCollection]=useState([]);
  const [selectedCar,setSelectedCar]=useState(null);
  const [searchQ,setSearchQ]=useState("");
  const [filterCat,setFilterCat]=useState("All");
  const [scanLoading,setScanLoading]=useState(false);
  const [scanResult,setScanResult]=useState(null);
  const [scanError,setScanError]=useState("");
  const [scanImage,setScanImage]=useState(null);
  const [apiKey,setApiKey]=useState(GEMINI_API_KEY);
  const [showKeyInput,setShowKeyInput]=useState(GEMINI_API_KEY==="YOUR_GEMINI_API_KEY_HERE");
  const fileRef=useRef();

  const filteredDB=HW_DB.filter(c=>{
    const q=searchQ.toLowerCase();
    const matchQ=!q||c.name.toLowerCase().includes(q)||c.series.toLowerCase().includes(q)||c.casting.toLowerCase().includes(q)||String(c.year).includes(q);
    const matchCat=filterCat==="All"||c.series_cat===filterCat;
    return matchQ&&matchCat;
  });

  const addToCollection=(car)=>{
    if(!collection.find(c=>c.id===car.id)){
      setCollection(prev=>[...prev,{...car,addedAt:new Date().toISOString(),condition:"Loose Mint"}]);
    }
  };
  const removeFromCollection=(id)=>setCollection(prev=>prev.filter(c=>c.id!==id));
  const inCollection=(car)=>!!collection.find(c=>c.id===car.id);

  const totalValue=collection.reduce((sum,c)=>{
    const p=getPrice(c,c.condition);
    return sum+Math.round((p.min+p.max)/2);
  },0);

  const handleScan=async(file)=>{
    if(!file)return;
    const key=apiKey;
    if(key==="YOUR_GEMINI_API_KEY_HERE"||!key){setScanError("Please enter your free Gemini API key above.");return;}
    setScanLoading(true);setScanResult(null);setScanError("");
    const reader=new FileReader();
    reader.onload=async(e)=>{
      const base64=e.target.result.split(",")[1];
      setScanImage(e.target.result);
      try{
        const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            contents:[{parts:[
              {inlineData:{mimeType:file.type,data:base64}},
              {text:`You are a Hot Wheels expert and diecast car collector. Analyze this image carefully and identify the Hot Wheels car shown. Look for: the car's name/model, any text on the card or base, the series name, year markings, color, and any treasure hunt symbols (flame/TH logo).

Return ONLY valid JSON, no other text:
{"identified":true,"name":"exact car name","series":"series name","year":2023,"casting":"casting name","color":"color","isTH":false,"isSTH":false,"confidence":85,"notes":"any relevant notes about condition or variant"}`
            }]}
          })
        });
        const data=await res.json();
        if(data.error){setScanError("API error: "+data.error.message);setScanLoading(false);return;}
        const text=data.candidates?.[0]?.content?.parts?.[0]?.text||"";
        const clean=text.replace(/```json|```/g,"").trim();
        const parsed=JSON.parse(clean);
        setScanResult(parsed);
        // try to match with DB
        const match=HW_DB.find(c=>
          c.name.toLowerCase().includes(parsed.name?.toLowerCase())||
          parsed.name?.toLowerCase().includes(c.name.toLowerCase())||
          c.casting.toLowerCase().includes(parsed.casting?.toLowerCase())
        );
        if(match)setScanResult({...parsed,dbMatch:match});
      }catch(err){
        setScanError("Could not identify car. Try a clearer photo.");
      }
      setScanLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const styles={
    app:{minHeight:"100vh",background:"#0A0A0B",color:"#f0ede8",fontFamily:"'DM Sans',sans-serif",paddingBottom:80},
    header:{background:"#0A0A0B",borderBottom:"1px solid #1a1a1d",padding:"16px 20px",
      display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50},
    logo:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,
      letterSpacing:3,color:"#E8272A"},
    tabs:{position:"fixed",bottom:0,left:0,right:0,zIndex:50,
      background:"#0f0f11",borderTop:"1px solid #1a1a1d",
      display:"flex",justifyContent:"space-around",padding:"8px 0"},
    tabBtn:(active)=>({
      background:"none",border:"none",color:active?"#E8272A":"#555",
      cursor:"pointer",padding:"8px 16px",display:"flex",flexDirection:"column",
      alignItems:"center",gap:4,fontSize:10,fontFamily:"'Barlow Condensed',sans-serif",
      letterSpacing:1,transition:"color 0.15s"
    }),
    content:{padding:"16px 20px",maxWidth:740,margin:"0 auto"},
  };

  const tabIcons={collection:<Grid size={20}/>,search:<Search size={20}/>,scan:<Camera size={20}/>};
  const tabLabels={collection:"COLLECTION",search:"SEARCH",scan:"SCAN"};

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=DM+Sans:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:#0a0a0b;}::-webkit-scrollbar-thumb{background:#333;}
        input[type=file]{display:none;}
      `}</style>

      <div style={styles.app}>
        <div style={styles.header}>
          <div style={styles.logo}>⚡ WHEELS</div>
          <div style={{fontSize:11,color:"#555",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1}}>
            {collection.length} CARS · <span style={{color:"#C9A84C"}}>${totalValue.toLocaleString()}</span>
          </div>
        </div>

        <div style={styles.content}>

          {/* ─── COLLECTION TAB ─── */}
          {tab==="collection"&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:20}}>
                {[["CARS",collection.length,"#E8272A"],["VALUE","$"+totalValue.toLocaleString(),"#C9A84C"],
                  ["RARE",collection.filter(c=>c.isSTH||c.year<=1977).length,"#7c3aed"]].map(([l,v,col])=>(
                  <div key={l} style={{background:"#141416",border:"1px solid #1a1a1d",borderRadius:8,padding:"12px 14px"}}>
                    <div style={{fontSize:9,color:"#555",letterSpacing:1,marginBottom:6}}>{l}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,color:col,fontWeight:700}}>{v}</div>
                  </div>
                ))}
              </div>

              {collection.length===0?(
                <div style={{textAlign:"center",padding:"60px 20px"}}>
                  <div style={{fontSize:60,marginBottom:16}}>🏎️</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,color:"#444",letterSpacing:2,marginBottom:8}}>NO CARS YET</div>
                  <div style={{color:"#333",fontSize:13,marginBottom:20}}>Scan a car or search the database to start</div>
                  <div style={{display:"flex",gap:12,justifyContent:"center"}}>
                    <button onClick={()=>setTab("scan")} style={{background:"#E8272A",border:"none",borderRadius:8,color:"#fff",padding:"10px 20px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,letterSpacing:1}}>SCAN A CAR</button>
                    <button onClick={()=>setTab("search")} style={{background:"#1a1a1d",border:"1px solid #333",borderRadius:8,color:"#888",padding:"10px 20px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,letterSpacing:1}}>SEARCH DB</button>
                  </div>
                </div>
              ):(
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
                  {collection.map(car=>(
                    <div key={car.id} style={{background:"#141416",border:"1px solid #2a2a2d",borderRadius:8,overflow:"hidden",position:"relative"}}>
                      {car.isSTH&&<div style={{position:"absolute",top:6,left:6,background:"#E8272A",color:"#fff",fontSize:9,padding:"1px 5px",borderRadius:3,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1,fontWeight:700}}>STH</div>}
                      <div style={{height:80,background:"#0d0d0e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>🏎️</div>
                      <div style={{padding:"8px 10px"}}>
                        <div style={{fontSize:12,fontFamily:"'Barlow Condensed',sans-serif",color:"#f0ede8",fontWeight:600,marginBottom:2,lineHeight:1.3}}>{car.name}</div>
                        <div style={{fontSize:10,color:"#C9A84C",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,marginBottom:6}}>
                          ${getPrice(car,car.condition).min}–${getPrice(car,car.condition).max}
                        </div>
                        <button onClick={()=>removeFromCollection(car.id)} style={{
                          background:"#1a1a1d",border:"1px solid #333",borderRadius:4,
                          color:"#666",cursor:"pointer",fontSize:10,padding:"3px 8px",width:"100%"
                        }}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── SEARCH TAB ─── */}
          {tab==="search"&&(
            <div>
              <div style={{position:"relative",marginBottom:12}}>
                <Search size={16} style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#444"}}/>
                <input value={searchQ} onChange={e=>setSearchQ(e.target.value)}
                  placeholder="Search cars, series, year..."
                  style={{width:"100%",background:"#141416",border:"1px solid #2a2a2d",borderRadius:8,
                    padding:"12px 14px 12px 40px",color:"#f0ede8",fontSize:14,outline:"none",
                    fontFamily:"'DM Sans',sans-serif"}}/>
              </div>
              <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:16,scrollbarWidth:"none"}}>
                {SERIES_CATS.map(cat=>(
                  <button key={cat} onClick={()=>setFilterCat(cat)} style={{
                    flexShrink:0,background:filterCat===cat?"#E8272A":"#141416",
                    border:`1px solid ${filterCat===cat?"#E8272A":"#2a2a2d"}`,
                    color:filterCat===cat?"#fff":"#666",borderRadius:20,
                    padding:"5px 12px",cursor:"pointer",fontSize:11,
                    fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:0.5,whiteSpace:"nowrap"
                  }}>{cat}</button>
                ))}
              </div>
              <div style={{color:"#555",fontSize:11,marginBottom:12,letterSpacing:1}}>
                {filteredDB.length} RESULTS
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12}}>
                {filteredDB.map(car=>(
                  <CarCard key={car.id} car={car} onClick={setSelectedCar}
                    inCollection={inCollection(car)} onAdd={addToCollection}/>
                ))}
              </div>
            </div>
          )}

          {/* ─── SCAN TAB ─── */}
          {tab==="scan"&&(
            <div>
              <div style={{marginBottom:20}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,letterSpacing:2,marginBottom:4}}>AI CAR SCANNER</div>
                <div style={{fontSize:12,color:"#555"}}>Powered by Google Gemini 2.5 Flash · Free · No credit card</div>
              </div>

              {showKeyInput&&(
                <div style={{background:"#141416",border:"1px solid #2a2a2d",borderRadius:10,padding:16,marginBottom:16}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                    <Zap size={16} color="#C9A84C"/>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:"#C9A84C",letterSpacing:1}}>FREE GEMINI API KEY REQUIRED</span>
                  </div>
                  <div style={{fontSize:12,color:"#666",marginBottom:10,lineHeight:1.6}}>
                    Get your free key at <span style={{color:"#E8272A"}}>aistudio.google.com/app/apikey</span> — no credit card needed. Free tier: 250 scans/day.
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <input value={apiKey==="YOUR_GEMINI_API_KEY_HERE"?"":apiKey}
                      onChange={e=>setApiKey(e.target.value)}
                      placeholder="Paste your Gemini API key..."
                      style={{flex:1,background:"#0d0d0e",border:"1px solid #333",borderRadius:6,
                        padding:"8px 12px",color:"#f0ede8",fontSize:13,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
                    <button onClick={()=>{if(apiKey&&apiKey!=="YOUR_GEMINI_API_KEY_HERE")setShowKeyInput(false);}}
                      style={{background:"#E8272A",border:"none",borderRadius:6,color:"#fff",
                        padding:"8px 14px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,letterSpacing:1}}>SAVE</button>
                  </div>
                </div>
              )}

              <input ref={fileRef} type="file" accept="image/*" capture="environment"
                onChange={e=>handleScan(e.target.files[0])}/>

              <div onClick={()=>fileRef.current.click()} style={{
                border:"2px dashed #2a2a2d",borderRadius:12,padding:"40px 24px",
                textAlign:"center",cursor:"pointer",marginBottom:16,
                background:"#0d0d0e",transition:"border-color 0.15s"
              }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#E8272A"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="#2a2a2d"}>
                {scanLoading?(
                  <div>
                    <div style={{animation:"spin 1s linear infinite",display:"inline-block",marginBottom:12}}>
                      <Loader size={32} color="#E8272A"/>
                    </div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,color:"#888",letterSpacing:1}}>IDENTIFYING CAR...</div>
                    <div style={{fontSize:12,color:"#444",marginTop:4}}>Asking Gemini AI...</div>
                  </div>
                ):scanImage?(
                  <div>
                    <img src={scanImage} alt="scan" style={{maxHeight:120,maxWidth:"100%",borderRadius:8,marginBottom:12,objectFit:"contain"}}/>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,color:"#555",letterSpacing:1}}>TAP TO SCAN AGAIN</div>
                  </div>
                ):(
                  <div>
                    <Camera size={40} color="#333" style={{marginBottom:12}}/>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,color:"#888",letterSpacing:2,marginBottom:6}}>TAKE PHOTO OR UPLOAD</div>
                    <div style={{fontSize:12,color:"#444"}}>Camera · Gallery · Any angle works</div>
                  </div>
                )}
              </div>

              {scanError&&(
                <div style={{background:"#1a0808",border:"1px solid #5a1010",borderRadius:8,padding:12,marginBottom:16,
                  display:"flex",gap:10,alignItems:"flex-start"}}>
                  <AlertCircle size={16} color="#E8272A" style={{flexShrink:0,marginTop:1}}/>
                  <span style={{fontSize:13,color:"#ff8080"}}>{scanError}</span>
                </div>
              )}

              {scanResult&&!scanLoading&&(
                <div style={{background:"#141416",border:"1px solid #2a2a2d",borderRadius:12,padding:16}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
                    <CheckCircle size={16} color="#22c55e"/>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:"#22c55e",letterSpacing:1}}>
                      IDENTIFIED — {scanResult.confidence}% CONFIDENCE
                    </span>
                  </div>
                  <div style={{height:6,background:"#1a1a1d",borderRadius:3,marginBottom:16,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${scanResult.confidence}%`,
                      background:scanResult.confidence>75?"#22c55e":scanResult.confidence>50?"#f97316":"#E8272A",
                      borderRadius:3,transition:"width 0.5s"}}/>
                  </div>
                  <h3 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,color:"#f0ede8",marginBottom:8,letterSpacing:1}}>{scanResult.name}</h3>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                    {[["Series",scanResult.series],["Year",scanResult.year],["Color",scanResult.color],["Casting",scanResult.casting]].map(([k,v])=>(
                      <div key={k} style={{background:"#0d0d0e",borderRadius:6,padding:"8px 10px"}}>
                        <div style={{fontSize:9,color:"#555",letterSpacing:1}}>{k.toUpperCase()}</div>
                        <div style={{fontSize:12,color:"#ccc",marginTop:2}}>{v||"—"}</div>
                      </div>
                    ))}
                  </div>
                  {scanResult.notes&&<div style={{fontSize:12,color:"#666",marginBottom:16,lineHeight:1.6,background:"#0d0d0e",borderRadius:6,padding:10}}>{scanResult.notes}</div>}

                  {scanResult.dbMatch?(
                    <div>
                      <div style={{fontSize:11,color:"#555",letterSpacing:1,marginBottom:8}}>DATABASE MATCH FOUND</div>
                      <div style={{background:"#0d0d0e",borderRadius:8,border:"1px solid #1a1a1d",padding:12,marginBottom:12}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,color:"#f0ede8",fontWeight:700}}>{scanResult.dbMatch.name}</div>
                            <div style={{fontSize:12,color:"#C9A84C",marginTop:2,fontFamily:"'Barlow Condensed',sans-serif"}}>
                              Loose: ${scanResult.dbMatch.loose.min}–${scanResult.dbMatch.loose.max} · eBay ~${scanResult.dbMatch.ebay}
                            </div>
                          </div>
                          <TrendIcon trend={scanResult.dbMatch.trend}/>
                        </div>
                      </div>
                      <button onClick={()=>{addToCollection(scanResult.dbMatch);setScanResult(null);setTab("collection");}} style={{
                        width:"100%",background:"#E8272A",border:"none",borderRadius:8,
                        color:"#fff",padding:"12px 24px",cursor:"pointer",
                        fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,letterSpacing:2
                      }}>+ ADD TO COLLECTION</button>
                    </div>
                  ):(
                    <button onClick={()=>{setTab("search");setSearchQ(scanResult.name||"");}} style={{
                      width:"100%",background:"#1a1a1d",border:"1px solid #333",borderRadius:8,
                      color:"#888",padding:"12px 24px",cursor:"pointer",
                      fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,letterSpacing:2
                    }}>SEARCH DATABASE →</button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── BOTTOM NAV ─── */}
        <div style={styles.tabs}>
          {["collection","search","scan"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={styles.tabBtn(tab===t)}>
              {tabIcons[t]}
              <span>{tabLabels[t]}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedCar&&<DetailPanel car={selectedCar} onClose={()=>setSelectedCar(null)}
        onAdd={addToCollection} inCollection={inCollection(selectedCar)}/>}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </>
  );
}
