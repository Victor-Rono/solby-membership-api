/* eslint-disable prettier/prettier */
import { sortArrayByKey } from 'victor-dev-toolbox';
import { BankInterface } from "../interfaces/finance.interface";


const banks: BankInterface[] = JSON.parse(
    `[
    {
        "id": 1,
        "name": "Kenya Commercial Bank Limited",
        "code": "01",
        "paybill": "522522",
        "branches": [
            {
                "name": "Eastleigh ",
                "code": "091",
                "bank_id": 1
            },
            {
                "name": "KCB CPC",
                "code": "092",
                "bank_id": 1
            },
            {
                "name": "Head Office ",
                "code": "094",
                "bank_id": 1
            },
            {
                "name": "Wote ",
                "code": "095",
                "bank_id": 1
            },
            {
                "name": "Head Office Finance",
                "code": "096",
                "bank_id": 1
            },
            {
                "name": "Moi Avenue Nairobi",
                "code": "100",
                "bank_id": 1
            },
            {
                "name": "Kipande House ",
                "code": "101",
                "bank_id": 1
            },
            {
                "name": "Treasury Sq Mombasa ",
                "code": "102",
                "bank_id": 1
            },
            {
                "name": "Nakuru ",
                "code": "103",
                "bank_id": 1
            },
            {
                "name": "Kicc ",
                "code": "104",
                "bank_id": 1
            },
            {
                "name": "Kisumu ",
                "code": "105",
                "bank_id": 1
            },
            {
                "name": "Kericho ",
                "code": "106",
                "bank_id": 1
            },
            {
                "name": "Tom Mboya ",
                "code": "107",
                "bank_id": 1
            },
            {
                "name": "Thika ",
                "code": "108",
                "bank_id": 1
            },
            {
                "name": "Eldoret ",
                "code": "109",
                "bank_id": 1
            },
            {
                "name": "Kakamega ",
                "code": "110",
                "bank_id": 1
            },
            {
                "name": "Kilindini Mombasa ",
                "code": "111",
                "bank_id": 1
            },
            {
                "name": "Nyeri ",
                "code": "112",
                "bank_id": 1
            },
            {
                "name": "Industrial Area Nairobi ",
                "code": "113",
                "bank_id": 1
            },
            {
                "name": "River Road ",
                "code": "114",
                "bank_id": 1
            },
            {
                "name": "Muranga ",
                "code": "115",
                "bank_id": 1
            },
            {
                "name": "Embu ",
                "code": "116",
                "bank_id": 1
            },
            {
                "name": "Kangema ",
                "code": "117",
                "bank_id": 1
            },
            {
                "name": "Kiambu ",
                "code": "119",
                "bank_id": 1
            },
            {
                "name": "Karatina ",
                "code": "120",
                "bank_id": 1
            },
            {
                "name": "Siaya ",
                "code": "121",
                "bank_id": 1
            },
            {
                "name": "Nyahururu ",
                "code": "122",
                "bank_id": 1
            },
            {
                "name": "Meru ",
                "code": "123",
                "bank_id": 1
            },
            {
                "name": "Mumias ",
                "code": "124",
                "bank_id": 1
            },
            {
                "name": "Nanyuki ",
                "code": "125",
                "bank_id": 1
            },
            {
                "name": "Moyale ",
                "code": "127",
                "bank_id": 1
            },
            {
                "name": "Kikuyu ",
                "code": "129",
                "bank_id": 1
            },
            {
                "name": "Tala ",
                "code": "130",
                "bank_id": 1
            },
            {
                "name": "Kajiado ",
                "code": "131",
                "bank_id": 1
            },
            {
                "name": "KCB Custody services",
                "code": "999",
                "bank_id": 1
            },
            {
                "name": "Matuu ",
                "code": "134",
                "bank_id": 1
            },
            {
                "name": "Kitui ",
                "code": "135",
                "bank_id": 1
            },
            {
                "name": "Mvita ",
                "code": "136",
                "bank_id": 1
            },
            {
                "name": "Jogoo Rd Nairobi ",
                "code": "137",
                "bank_id": 1
            },
            {
                "name": "Card Centre ",
                "code": "139",
                "bank_id": 1
            },
            {
                "name": "Marsabit ",
                "code": "140",
                "bank_id": 1
            },
            {
                "name": "Sarit Centre ",
                "code": "141",
                "bank_id": 1
            },
            {
                "name": "Loitokitok ",
                "code": "142",
                "bank_id": 1
            },
            {
                "name": "Nandi Hills ",
                "code": "143",
                "bank_id": 1
            },
            {
                "name": "Lodwar ",
                "code": "144",
                "bank_id": 1
            },
            {
                "name": "Un Gigiri ",
                "code": "145",
                "bank_id": 1
            },
            {
                "name": "Hola ",
                "code": "146",
                "bank_id": 1
            },
            {
                "name": "Ruiru ",
                "code": "147",
                "bank_id": 1
            },
            {
                "name": "Mwingi ",
                "code": "148",
                "bank_id": 1
            },
            {
                "name": "Kitale ",
                "code": "149",
                "bank_id": 1
            },
            {
                "name": "Mandera ",
                "code": "150",
                "bank_id": 1
            },
            {
                "name": "Kapenguria ",
                "code": "151",
                "bank_id": 1
            },
            {
                "name": "Kabarnet ",
                "code": "152",
                "bank_id": 1
            },
            {
                "name": "Wajir ",
                "code": "153",
                "bank_id": 1
            },
            {
                "name": "Maralal ",
                "code": "154",
                "bank_id": 1
            },
            {
                "name": "Limuru ",
                "code": "155",
                "bank_id": 1
            },
            {
                "name": "Ukunda ",
                "code": "157",
                "bank_id": 1
            },
            {
                "name": "Iten ",
                "code": "158",
                "bank_id": 1
            },
            {
                "name": "Gilgil ",
                "code": "159",
                "bank_id": 1
            },
            {
                "name": "Ongata Rongai ",
                "code": "161",
                "bank_id": 1
            },
            {
                "name": "Kitengela ",
                "code": "162",
                "bank_id": 1
            },
            {
                "name": "Eldama Ravine ",
                "code": "163",
                "bank_id": 1
            },
            {
                "name": "Kibwezi ",
                "code": "164",
                "bank_id": 1
            },
            {
                "name": "Kapsabet ",
                "code": "166",
                "bank_id": 1
            },
            {
                "name": "University Way ",
                "code": "167",
                "bank_id": 1
            },
            {
                "name": "KCB Eldoret West",
                "code": "168",
                "bank_id": 1
            },
            {
                "name": "Garissa ",
                "code": "169",
                "bank_id": 1
            },
            {
                "name": "Lamu ",
                "code": "173",
                "bank_id": 1
            },
            {
                "name": "Kilifi ",
                "code": "174",
                "bank_id": 1
            },
            {
                "name": "Milimani ",
                "code": "175",
                "bank_id": 1
            },
            {
                "name": "Nyamira ",
                "code": "176",
                "bank_id": 1
            },
            {
                "name": "Mukuruweini ",
                "code": "177",
                "bank_id": 1
            },
            {
                "name": "Village Market ",
                "code": "180",
                "bank_id": 1
            },
            {
                "name": "Bomet ",
                "code": "181",
                "bank_id": 1
            },
            {
                "name": "Mbale ",
                "code": "183",
                "bank_id": 1
            },
            {
                "name": "Narok ",
                "code": "184",
                "bank_id": 1
            },
            {
                "name": "Othaya ",
                "code": "185",
                "bank_id": 1
            },
            {
                "name": "Voi ",
                "code": "186",
                "bank_id": 1
            },
            {
                "name": "Webuye ",
                "code": "188",
                "bank_id": 1
            },
            {
                "name": "Sotik ",
                "code": "189",
                "bank_id": 1
            },
            {
                "name": "Naivasha ",
                "code": "190",
                "bank_id": 1
            },
            {
                "name": "Kisii ",
                "code": "191",
                "bank_id": 1
            },
            {
                "name": "Migori ",
                "code": "192",
                "bank_id": 1
            },
            {
                "name": "Githunguri ",
                "code": "193",
                "bank_id": 1
            },
            {
                "name": "Machakos ",
                "code": "194",
                "bank_id": 1
            },
            {
                "name": "Kerugoya ",
                "code": "195",
                "bank_id": 1
            },
            {
                "name": "Chuka ",
                "code": "196",
                "bank_id": 1
            },
            {
                "name": "Bungoma ",
                "code": "197",
                "bank_id": 1
            },
            {
                "name": "Wundanyi ",
                "code": "198",
                "bank_id": 1
            },
            {
                "name": "Malindi ",
                "code": "199",
                "bank_id": 1
            },
            {
                "name": "Capital Hill ",
                "code": "201",
                "bank_id": 1
            },
            {
                "name": "Karen ",
                "code": "202",
                "bank_id": 1
            },
            {
                "name": "Lokichogio ",
                "code": "203",
                "bank_id": 1
            },
            {
                "name": "Gateway Msa Road ",
                "code": "204",
                "bank_id": 1
            },
            {
                "name": "Buruburu ",
                "code": "205",
                "bank_id": 1
            },
            {
                "name": "Chogoria ",
                "code": "206",
                "bank_id": 1
            },
            {
                "name": "Kangare ",
                "code": "207",
                "bank_id": 1
            },
            {
                "name": "Kianyaga ",
                "code": "208",
                "bank_id": 1
            },
            {
                "name": "Nkubu ",
                "code": "209",
                "bank_id": 1
            },
            {
                "name": "Ol Kalou ",
                "code": "210",
                "bank_id": 1
            },
            {
                "name": "Makuyu ",
                "code": "211",
                "bank_id": 1
            },
            {
                "name": "Mwea ",
                "code": "212",
                "bank_id": 1
            },
            {
                "name": "Njambini ",
                "code": "213",
                "bank_id": 1
            },
            {
                "name": "Gatundu ",
                "code": "214",
                "bank_id": 1
            },
            {
                "name": "Emali ",
                "code": "215",
                "bank_id": 1
            },
            {
                "name": "Isiolo ",
                "code": "216",
                "bank_id": 1
            },
            {
                "name": "KCB Flamingo",
                "code": "217",
                "bank_id": 1
            },
            {
                "name": "Njoro ",
                "code": "218",
                "bank_id": 1
            },
            {
                "name": "Mutomo ",
                "code": "219",
                "bank_id": 1
            },
            {
                "name": "Mariakani ",
                "code": "220",
                "bank_id": 1
            },
            {
                "name": "Mpeketoni ",
                "code": "221",
                "bank_id": 1
            },
            {
                "name": "Mtitu Andei ",
                "code": "222",
                "bank_id": 1
            },
            {
                "name": "Mtwapa ",
                "code": "223",
                "bank_id": 1
            },
            {
                "name": "Taveta ",
                "code": "224",
                "bank_id": 1
            },
            {
                "name": "Kengeleni ",
                "code": "225",
                "bank_id": 1
            },
            {
                "name": "Garsen ",
                "code": "226",
                "bank_id": 1
            },
            {
                "name": "Watamu ",
                "code": "227",
                "bank_id": 1
            },
            {
                "name": "Bondo ",
                "code": "228",
                "bank_id": 1
            },
            {
                "name": "Busia ",
                "code": "229",
                "bank_id": 1
            },
            {
                "name": "Homa Bay ",
                "code": "230",
                "bank_id": 1
            },
            {
                "name": "Kapsowar ",
                "code": "231",
                "bank_id": 1
            },
            {
                "name": "Kehancha ",
                "code": "232",
                "bank_id": 1
            },
            {
                "name": "Keroka ",
                "code": "233",
                "bank_id": 1
            },
            {
                "name": "Kilgoris ",
                "code": "234",
                "bank_id": 1
            },
            {
                "name": "Kimilili ",
                "code": "235",
                "bank_id": 1
            },
            {
                "name": "Litein ",
                "code": "236",
                "bank_id": 1
            },
            {
                "name": "Londiani Branch ",
                "code": "237",
                "bank_id": 1
            },
            {
                "name": "Luanda ",
                "code": "238",
                "bank_id": 1
            },
            {
                "name": "Malaba ",
                "code": "239",
                "bank_id": 1
            },
            {
                "name": "Muhoroni ",
                "code": "240",
                "bank_id": 1
            },
            {
                "name": "Oyugis ",
                "code": "241",
                "bank_id": 1
            },
            {
                "name": "Ugunja ",
                "code": "242",
                "bank_id": 1
            },
            {
                "name": "United Mall ",
                "code": "243",
                "bank_id": 1
            },
            {
                "name": "Serem ",
                "code": "244",
                "bank_id": 1
            },
            {
                "name": "Sondu ",
                "code": "245",
                "bank_id": 1
            },
            {
                "name": "Kisumu West ",
                "code": "246",
                "bank_id": 1
            },
            {
                "name": "Marigat ",
                "code": "247",
                "bank_id": 1
            },
            {
                "name": "Mois Bridge ",
                "code": "248",
                "bank_id": 1
            },
            {
                "name": "Mashariki ",
                "code": "249",
                "bank_id": 1
            },
            {
                "name": "Naro Moro ",
                "code": "250",
                "bank_id": 1
            },
            {
                "name": "Kiriaini ",
                "code": "251",
                "bank_id": 1
            },
            {
                "name": "Egerton University ",
                "code": "252",
                "bank_id": 1
            },
            {
                "name": "Maua ",
                "code": "253",
                "bank_id": 1
            },
            {
                "name": "Kawangare ",
                "code": "254",
                "bank_id": 1
            },
            {
                "name": "Kimathi ",
                "code": "255",
                "bank_id": 1
            },
            {
                "name": "Namanga ",
                "code": "256",
                "bank_id": 1
            },
            {
                "name": "Gikomba ",
                "code": "257",
                "bank_id": 1
            },
            {
                "name": "Kwale ",
                "code": "258",
                "bank_id": 1
            },
            {
                "name": "Prestige Plaza ",
                "code": "259",
                "bank_id": 1
            },
            {
                "name": "Kariobangi ",
                "code": "260",
                "bank_id": 1
            },
            {
                "name": "Biashara Street ",
                "code": "263",
                "bank_id": 1
            },
            {
                "name": "Ngara ",
                "code": "266",
                "bank_id": 1
            },
            {
                "name": "Kyuso ",
                "code": "267",
                "bank_id": 1
            },
            {
                "name": "Masii ",
                "code": "270",
                "bank_id": 1
            },
            {
                "name": "Menengai Crater",
                "code": "271",
                "bank_id": 1
            },
            {
                "name": "Town Centre ",
                "code": "272",
                "bank_id": 1
            },
            {
                "name": "Makindu ",
                "code": "278",
                "bank_id": 1
            },
            {
                "name": "Rongo ",
                "code": "283",
                "bank_id": 1
            },
            {
                "name": "Isibania ",
                "code": "284",
                "bank_id": 1
            },
            {
                "name": "Kiserian ",
                "code": "285",
                "bank_id": 1
            },
            {
                "name": "Mwembe Tayari ",
                "code": "286",
                "bank_id": 1
            },
            {
                "name": "Kisauni ",
                "code": "287",
                "bank_id": 1
            },
            {
                "name": "Haile Selassie ",
                "code": "288",
                "bank_id": 1
            },
            {
                "name": "Salama House Mortgage Centre",
                "code": "289",
                "bank_id": 1
            },
            {
                "name": "Garden Plaza ",
                "code": "290",
                "bank_id": 1
            },
            {
                "name": "Sarit Centre Mortgage Centre",
                "code": "291",
                "bank_id": 1
            },
            {
                "name": "Cpc Bulk Corporate Cheques ",
                "code": "292",
                "bank_id": 1
            },
            {
                "name": "Trade Services",
                "code": "293",
                "bank_id": 1
            },
            {
                "name": "Nairobi High Court",
                "code": "295",
                "bank_id": 1
            },
            {
                "name": "Mombasa High Court",
                "code": "296",
                "bank_id": 1
            },
            {
                "name": "Kisumu Airport",
                "code": "297",
                "bank_id": 1
            },
            {
                "name": "Port Victoria",
                "code": "298",
                "bank_id": 1
            },
            {
                "name": "Moi International Airport",
                "code": "299",
                "bank_id": 1
            },
            {
                "name": "Nyali",
                "code": "300",
                "bank_id": 1
            },
            {
                "name": "Westgate Advantage",
                "code": "301",
                "bank_id": 1
            },
            {
                "name": "Diaspora ",
                "code": "302",
                "bank_id": 1
            },
            {
                "name": "Custody Services",
                "code": "133",
                "bank_id": 1
            },
            {
                "name": "Hurlingham",
                "code": "306",
                "bank_id": 1
            },
            {
                "name": "Kayole",
                "code": "324",
                "bank_id": 1
            },
            {
                "name": "Parklands",
                "code": "334",
                "bank_id": 1
            },
            {
                "name": "JKUAT",
                "code": "314",
                "bank_id": 1
            }
        ]
    },
    {
        "id": 2,
        "name": "Standard Chartered Bank Kenya Limited",
        "code": "02",
        "paybill": null,
        "branches": [
            {
                "name": "Eldoret ",
                "code": "000",
                "bank_id": 2
            },
            {
                "name": "Kericho ",
                "code": "001",
                "bank_id": 2
            },
            {
                "name": "Kisumu ",
                "code": "002",
                "bank_id": 2
            },
            {
                "name": "Kitale ",
                "code": "003",
                "bank_id": 2
            },
            {
                "name": "Treasury Square ",
                "code": "004",
                "bank_id": 2
            },
            {
                "name": "Kilindini ",
                "code": "005",
                "bank_id": 2
            },
            {
                "name": "Kenyatta Avenue ",
                "code": "006",
                "bank_id": 2
            },
            {
                "name": "Moi Avenue ",
                "code": "008",
                "bank_id": 2
            },
            {
                "name": "Nakuru ",
                "code": "009",
                "bank_id": 2
            },
            {
                "name": "Nanyuki ",
                "code": "010",
                "bank_id": 2
            },
            {
                "name": "Nyeri ",
                "code": "011",
                "bank_id": 2
            },
            {
                "name": "Thika ",
                "code": "012",
                "bank_id": 2
            },
            {
                "name": "Westlands ",
                "code": "015",
                "bank_id": 2
            },
            {
                "name": "Machakos ",
                "code": "016",
                "bank_id": 2
            },
            {
                "name": "Meru ",
                "code": "017",
                "bank_id": 2
            },
            {
                "name": "Harambee Avenue ",
                "code": "019",
                "bank_id": 2
            },
            {
                "name": "Kiambu ",
                "code": "020",
                "bank_id": 2
            },
            {
                "name": "Industrial Area ",
                "code": "053",
                "bank_id": 2
            },
            {
                "name": "Kakamega ",
                "code": "054",
                "bank_id": 2
            },
            {
                "name": "Malindi ",
                "code": "060",
                "bank_id": 2
            },
            {
                "name": "Koinage",
                "code": "064",
                "bank_id": 2
            },
            {
                "name": "Yaya Centre Branch ",
                "code": "071",
                "bank_id": 2
            },
            {
                "name": "Ruaraka ",
                "code": "072",
                "bank_id": 2
            },
            {
                "name": "Langata ",
                "code": "073",
                "bank_id": 2
            },
            {
                "name": "Makupa ",
                "code": "074",
                "bank_id": 2
            },
            {
                "name": "Karen ",
                "code": "075",
                "bank_id": 2
            },
            {
                "name": "Muthaiga ",
                "code": "076",
                "bank_id": 2
            },
            {
                "name": "C.o.u ",
                "code": "078",
                "bank_id": 2
            },
            {
                "name": "Ukay ",
                "code": "079",
                "bank_id": 2
            },
            {
                "name": "Eastleigh ",
                "code": "080",
                "bank_id": 2
            },
            {
                "name": "Kisii ",
                "code": "081",
                "bank_id": 2
            },
            {
                "name": "Upper Hill Branch ",
                "code": "082",
                "bank_id": 2
            },
            {
                "name": "Nyali ",
                "code": "083",
                "bank_id": 2
            },
            {
                "name": "Chiromo",
                "code": "084",
                "bank_id": 2
            },
            {
                "name": "Greenspan",
                "code": "085",
                "bank_id": 2
            },
            {
                "name": "The T-Mall",
                "code": "086",
                "bank_id": 2
            },
            {
                "name": "The Junction",
                "code": "087",
                "bank_id": 2
            },
            {
                "name": "Bungoma ",
                "code": "090",
                "bank_id": 2
            }
        ]
    },
    {
        "id": 3,
        "name": "Absa Bank Kenya  Limited",
        "code": "03",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office - Vpc ",
                "code": "001",
                "bank_id": 3
            },
            {
                "name": "Kapsabet Branch ",
                "code": "002",
                "bank_id": 3
            },
            {
                "name": "Eldoret Branch ",
                "code": "003",
                "bank_id": 3
            },
            {
                "name": "Embu Branch ",
                "code": "004",
                "bank_id": 3
            },
            {
                "name": "Murang A Branch ",
                "code": "005",
                "bank_id": 3
            },
            {
                "name": "Kapenguria Branch ",
                "code": "006",
                "bank_id": 3
            },
            {
                "name": "Kericho Branch ",
                "code": "007",
                "bank_id": 3
            },
            {
                "name": "Kisii Branch ",
                "code": "008",
                "bank_id": 3
            },
            {
                "name": "Kisumu Branch ",
                "code": "009",
                "bank_id": 3
            },
            {
                "name": "South C Branch ",
                "code": "010",
                "bank_id": 3
            },
            {
                "name": "Limuru Branch ",
                "code": "011",
                "bank_id": 3
            },
            {
                "name": "Malindi Branch ",
                "code": "012",
                "bank_id": 3
            },
            {
                "name": "Meru Branch ",
                "code": "013",
                "bank_id": 3
            },
            {
                "name": "Eastleigh Branch ",
                "code": "014",
                "bank_id": 3
            },
            {
                "name": "Kitui Branch ",
                "code": "015",
                "bank_id": 3
            },
            {
                "name": "Nkrumah Road Branch ",
                "code": "016",
                "bank_id": 3
            },
            {
                "name": "Garissa Branch ",
                "code": "017",
                "bank_id": 3
            },
            {
                "name": "Nyamira Branch ",
                "code": "018",
                "bank_id": 3
            },
            {
                "name": "Kilifi Branch ",
                "code": "019",
                "bank_id": 3
            },
            {
                "name": "Office Park Westlands ",
                "code": "020",
                "bank_id": 3
            },
            {
                "name": "Barclaycard Operations ",
                "code": "021",
                "bank_id": 3
            },
            {
                "name": "Paymants And International Services ",
                "code": "022",
                "bank_id": 3
            },
            {
                "name": "Gilgil Branch ",
                "code": "023",
                "bank_id": 3
            },
            {
                "name": "Githurai ",
                "code": "024",
                "bank_id": 3
            },
            {
                "name": "Kakamega Branch ",
                "code": "026",
                "bank_id": 3
            },
            {
                "name": "Nakuru East ",
                "code": "027",
                "bank_id": 3
            },
            {
                "name": "Buruburu ",
                "code": "028",
                "bank_id": 3
            },
            {
                "name": "Bomet ",
                "code": "029",
                "bank_id": 3
            },
            {
                "name": "Nyeri Branch ",
                "code": "030",
                "bank_id": 3
            },
            {
                "name": "Thika Branch ",
                "code": "031",
                "bank_id": 3
            },
            {
                "name": "Port Mombasa ",
                "code": "032",
                "bank_id": 3
            },
            {
                "name": "Gikomba ",
                "code": "033",
                "bank_id": 3
            },
            {
                "name": "Kawangware ",
                "code": "034",
                "bank_id": 3
            },
            {
                "name": "Mbale ",
                "code": "035",
                "bank_id": 3
            },
            {
                "name": "Plaza Premier Centre ",
                "code": "036",
                "bank_id": 3
            },
            {
                "name": "River Road Branch ",
                "code": "037",
                "bank_id": 3
            },
            {
                "name": "Chomba House-river Road ",
                "code": "038",
                "bank_id": 3
            },
            {
                "name": "Mumias Branch ",
                "code": "039",
                "bank_id": 3
            },
            {
                "name": "Machakos Branch ",
                "code": "040",
                "bank_id": 3
            },
            {
                "name": "Narok Branch ",
                "code": "041",
                "bank_id": 3
            },
            {
                "name": "Isiolo Branch ",
                "code": "042",
                "bank_id": 3
            },
            {
                "name": "Ngong Branch ",
                "code": "043",
                "bank_id": 3
            },
            {
                "name": "Maua Branch ",
                "code": "044",
                "bank_id": 3
            },
            {
                "name": "Hurlingham Branch",
                "code": "045",
                "bank_id": 3
            },
            {
                "name": "Makupa Branch ",
                "code": "046",
                "bank_id": 3
            },
            {
                "name": "Development House Branch ",
                "code": "047",
                "bank_id": 3
            },
            {
                "name": "Bungoma ",
                "code": "048",
                "bank_id": 3
            },
            {
                "name": "Lavington Branch ",
                "code": "049",
                "bank_id": 3
            },
            {
                "name": "Tala ",
                "code": "050",
                "bank_id": 3
            },
            {
                "name": "Homa Bay Branch ",
                "code": "051",
                "bank_id": 3
            },
            {
                "name": "Ongata Rongai Branch ",
                "code": "052",
                "bank_id": 3
            },
            {
                "name": "Othaya Branch ",
                "code": "053",
                "bank_id": 3
            },
            {
                "name": "Voi Branch ",
                "code": "054",
                "bank_id": 3
            },
            {
                "name": "Muthaiga Branch ",
                "code": "055",
                "bank_id": 3
            },
            {
                "name": "Barclays Advisory And Reg. Services ",
                "code": "056",
                "bank_id": 3
            },
            {
                "name": "Githunguri Branch ",
                "code": "057",
                "bank_id": 3
            },
            {
                "name": "Webuye Branch ",
                "code": "058",
                "bank_id": 3
            },
            {
                "name": "Kasarani Branch ",
                "code": "059",
                "bank_id": 3
            },
            {
                "name": "Chuka Branch ",
                "code": "060",
                "bank_id": 3
            },
            {
                "name": "Nakumatt-westgate Branch ",
                "code": "061",
                "bank_id": 3
            },
            {
                "name": "Kabarnet Branch ",
                "code": "062",
                "bank_id": 3
            },
            {
                "name": "Kerugoya Branch ",
                "code": "063",
                "bank_id": 3
            },
            {
                "name": "Taveta Branch ",
                "code": "064",
                "bank_id": 3
            },
            {
                "name": "Karen Branch ",
                "code": "065",
                "bank_id": 3
            },
            {
                "name": "Wundanyi Branch ",
                "code": "066",
                "bank_id": 3
            },
            {
                "name": "Ruaraka Branch ",
                "code": "067",
                "bank_id": 3
            },
            {
                "name": "Pamoja Branch ",
                "code": "068",
                "bank_id": 3
            },
            {
                "name": "Wote Branch ",
                "code": "069",
                "bank_id": 3
            },
            {
                "name": "Enterprise Road Branch ",
                "code": "070",
                "bank_id": 3
            },
            {
                "name": "Nakumatt Meru Branch ",
                "code": "071",
                "bank_id": 3
            },
            {
                "name": "Juja Branch ",
                "code": "072",
                "bank_id": 3
            },
            {
                "name": "Westlands Branch ",
                "code": "073",
                "bank_id": 3
            },
            {
                "name": "Kikuyu Branch ",
                "code": "074",
                "bank_id": 3
            },
            {
                "name": "Moi Avenue-nairobi Branch ",
                "code": "075",
                "bank_id": 3
            },
            {
                "name": "Kenyatta Avenue ",
                "code": "076",
                "bank_id": 3
            },
            {
                "name": "Barcalys Plaza Corporate Service Centre ",
                "code": "077",
                "bank_id": 3
            },
            {
                "name": "Kiriaini Branch ",
                "code": "078",
                "bank_id": 3
            },
            {
                "name": "Butere Road Branch ",
                "code": "079",
                "bank_id": 3
            },
            {
                "name": "Migori Branch ",
                "code": "080",
                "bank_id": 3
            },
            {
                "name": "Digo Branch ",
                "code": "081",
                "bank_id": 3
            },
            {
                "name": "Haile Selassie Avenue Branch ",
                "code": "082",
                "bank_id": 3
            },
            {
                "name": "Nairobi University Branch ",
                "code": "083",
                "bank_id": 3
            },
            {
                "name": "Bunyala Road ",
                "code": "084",
                "bank_id": 3
            },
            {
                "name": "Nairobi West Branch ",
                "code": "086",
                "bank_id": 3
            },
            {
                "name": "Parklands ",
                "code": "087",
                "bank_id": 3
            },
            {
                "name": "Busia ",
                "code": "088",
                "bank_id": 3
            },
            {
                "name": "Pangani Branch ",
                "code": "089",
                "bank_id": 3
            },
            {
                "name": "Abc Premier Life Centre ",
                "code": "090",
                "bank_id": 3
            },
            {
                "name": "Kariobangi Branch ",
                "code": "093",
                "bank_id": 3
            },
            {
                "name": "Queensway House Branch ",
                "code": "094",
                "bank_id": 3
            },
            {
                "name": "Nakumatt Embakasi Branch ",
                "code": "095",
                "bank_id": 3
            },
            {
                "name": "Barclays Merchant Finance Ltd. ",
                "code": "096",
                "bank_id": 3
            },
            {
                "name": "Barclays Securities Services (k ",
                "code": "097",
                "bank_id": 3
            },
            {
                "name": "Diani Branch ",
                "code": "100",
                "bank_id": 3
            },
            {
                "name": "Nairobi J.k.i.a Branch ",
                "code": "103",
                "bank_id": 3
            },
            {
                "name": "Village Market - Premier Life Centre ",
                "code": "105",
                "bank_id": 3
            },
            {
                "name": "Sarit Centre - Premier Life Centre ",
                "code": "106",
                "bank_id": 3
            },
            {
                "name": "Yaya Centre- Premier Life Centre ",
                "code": "109",
                "bank_id": 3
            },
            {
                "name": "Naivasha Branch ",
                "code": "111",
                "bank_id": 3
            },
            {
                "name": "Market Branch ",
                "code": "113",
                "bank_id": 3
            },
            {
                "name": "Changamwe Branch ",
                "code": "114",
                "bank_id": 3
            },
            {
                "name": "Rahimtulla Trust Towers - Premier Life Centre ",
                "code": "117",
                "bank_id": 3
            },
            {
                "name": "Nakuru West Branch ",
                "code": "125",
                "bank_id": 3
            },
            {
                "name": "Bamburi Branch ",
                "code": "128",
                "bank_id": 3
            },
            {
                "name": "Harambee Ave - Premier Life Centre ",
                "code": "130",
                "bank_id": 3
            },
            {
                "name": "Kitale Branch ",
                "code": "132",
                "bank_id": 3
            },
            {
                "name": "Nyahururu Branch ",
                "code": "139",
                "bank_id": 3
            },
            {
                "name": "Treasury Operations ",
                "code": "144",
                "bank_id": 3
            },
            {
                "name": "Moi Avenue Mombasa -  Premier Life Centre ",
                "code": "145",
                "bank_id": 3
            },
            {
                "name": "Cash Monitoring Unit ",
                "code": "151",
                "bank_id": 3
            },
            {
                "name": "Nanyuki Branch ",
                "code": "190",
                "bank_id": 3
            },
            {
                "name": "Karatina Branch ",
                "code": "206",
                "bank_id": 3
            },
            {
                "name": "Mombasa Nyerere Ave -  Premier Life Centre ",
                "code": "220",
                "bank_id": 3
            },
            {
                "name": "Consumer Operations ",
                "code": "273",
                "bank_id": 3
            },
            {
                "name": "Finance Department ",
                "code": "300",
                "bank_id": 3
            },
            {
                "name": "Documents And Securities  Dsc ",
                "code": "337",
                "bank_id": 3
            },
            {
                "name": "Retail Credit Team ",
                "code": "340",
                "bank_id": 3
            },
            {
                "name": "Credit Operations ",
                "code": "354",
                "bank_id": 3
            },
            {
                "name": "Head office",
                "code": "400",
                "bank_id": 3
            },
            {
                "name": "Two Rivers",
                "code": "140",
                "bank_id": 3
            }
        ]
    },
    {
        "id": 4,
        "name": "Bank of India",
        "code": "05",
        "paybill": null,
        "branches": [
            {
                "name": "Kenyatta Avenue - Nairobi ",
                "code": "000",
                "bank_id": 4
            },
            {
                "name": "Nkrumah Road - Mombasa ",
                "code": "001",
                "bank_id": 4
            },
            {
                "name": "Industrial Area ",
                "code": "002",
                "bank_id": 4
            },
            {
                "name": "Westlands ",
                "code": "003",
                "bank_id": 4
            }
        ]
    },
    {
        "id": 5,
        "name": "Bank of Baroda (Kenya Limited)",
        "code": "06",
        "paybill": null,
        "branches": [
            {
                "name": "Nairobi Main ",
                "code": "000",
                "bank_id": 5
            },
            {
                "name": "Digo Road- Mombasa ",
                "code": "002",
                "bank_id": 5
            },
            {
                "name": "Thika ",
                "code": "004",
                "bank_id": 5
            },
            {
                "name": "Kisumu ",
                "code": "005",
                "bank_id": 5
            },
            {
                "name": "Sarit Centre ",
                "code": "006",
                "bank_id": 5
            },
            {
                "name": "Industrial Area ",
                "code": "007",
                "bank_id": 5
            },
            {
                "name": "Eldoret ",
                "code": "008",
                "bank_id": 5
            },
            {
                "name": "Nakuru ",
                "code": "009",
                "bank_id": 5
            },
            {
                "name": "Kakamega",
                "code": "010",
                "bank_id": 5
            },
            {
                "name": "Nyali Mombasa",
                "code": "011",
                "bank_id": 5
            }
        ]
    },
    {
        "id": 6,
        "name": "NCBA BANK KENYA PLC",
        "code": "07",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office",
                "code": "000",
                "bank_id": 6
            },
            {
                "name": "Upper Hill",
                "code": "001",
                "bank_id": 6
            },
            {
                "name": "Wabera Street",
                "code": "002",
                "bank_id": 6
            },
            {
                "name": "Mama Ngina",
                "code": "003",
                "bank_id": 6
            },
            {
                "name": "Westlands Branch",
                "code": "004",
                "bank_id": 6
            },
            {
                "name": "Industrial Area ",
                "code": "005",
                "bank_id": 6
            },
            {
                "name": "Mamlaka",
                "code": "006",
                "bank_id": 6
            },
            {
                "name": "Village Market",
                "code": "007",
                "bank_id": 6
            },
            {
                "name": "Cargo Centre",
                "code": "008",
                "bank_id": 6
            },
            {
                "name": "Park Side",
                "code": "009",
                "bank_id": 6
            },
            {
                "name": "Galleria Mall ",
                "code": "016",
                "bank_id": 6
            },
            {
                "name": "Junction",
                "code": "017",
                "bank_id": 6
            },
            {
                "name": "Moi Avenue Mombasa ",
                "code": "020",
                "bank_id": 6
            },
            {
                "name": "Meru",
                "code": "021",
                "bank_id": 6
            },
            {
                "name": "Nakuru",
                "code": "022",
                "bank_id": 6
            },
            {
                "name": "Bamburi",
                "code": "023",
                "bank_id": 6
            },
            {
                "name": "Diani",
                "code": "024",
                "bank_id": 6
            },
            {
                "name": "Changamwe",
                "code": "025",
                "bank_id": 6
            },
            {
                "name": "Eldoret",
                "code": "026",
                "bank_id": 6
            },
            {
                "name": "Kisumu",
                "code": "027",
                "bank_id": 6
            },
            {
                "name": "Thika",
                "code": "028",
                "bank_id": 6
            },
            {
                "name": "NIC HOUSE",
                "code": "102",
                "bank_id": 6
            },
            {
                "name": "Machakos",
                "code": "032",
                "bank_id": 6
            },
            {
                "name": "Parklands",
                "code": "143",
                "bank_id": 6
            },
            {
                "name": "Harambee Avenue",
                "code": "110",
                "bank_id": 6
            },
            {
                "name": "MALL WESTLANDS",
                "code": "07105",
                "bank_id": 6
            },
            {
                "name": "ABC",
                "code": "122",
                "bank_id": 6
            },
            {
                "name": "Prestige",
                "code": "111",
                "bank_id": 6
            }
        ]
    },
    {
        "id": 7,
        "name": "Habib Bank Limited",
        "code": "08",
        "paybill": null,
        "branches": [
            {
                "name": "Mombasa ",
                "code": "046",
                "bank_id": 7
            },
            {
                "name": "Malindi ",
                "code": "047",
                "bank_id": 7
            },
            {
                "name": "Kimathi Street ",
                "code": "048",
                "bank_id": 7
            },
            {
                "name": "Kenyatta Avenue ",
                "code": "049",
                "bank_id": 7
            },
            {
                "name": "Kisumu ",
                "code": "086",
                "bank_id": 7
            }
        ]
    },
    {
        "id": 8,
        "name": "Central Bank of  Kenya",
        "code": "09",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office ",
                "code": "000",
                "bank_id": 8
            },
            {
                "name": "Head Office ",
                "code": "001",
                "bank_id": 8
            },
            {
                "name": "Mombasa ",
                "code": "002",
                "bank_id": 8
            },
            {
                "name": "Kisumu ",
                "code": "003",
                "bank_id": 8
            },
            {
                "name": "Eldoret ",
                "code": "004",
                "bank_id": 8
            }
        ]
    },
    {
        "id": 9,
        "name": "Prime Bank Limited",
        "code": "10",
        "paybill": null,
        "branches": [
            {
                "name": "H\/o Riverside ",
                "code": "000",
                "bank_id": 9
            },
            {
                "name": "Kenindia ",
                "code": "001",
                "bank_id": 9
            },
            {
                "name": "Biashara ",
                "code": "002",
                "bank_id": 9
            },
            {
                "name": "Mombasa ",
                "code": "003",
                "bank_id": 9
            },
            {
                "name": "Westlands ",
                "code": "004",
                "bank_id": 9
            },
            {
                "name": "Industrial Area ",
                "code": "005",
                "bank_id": 9
            },
            {
                "name": "Kisumu ",
                "code": "006",
                "bank_id": 9
            },
            {
                "name": "Parklands ",
                "code": "007",
                "bank_id": 9
            },
            {
                "name": "Riverside Drive ",
                "code": "008",
                "bank_id": 9
            },
            {
                "name": "Card Centre ",
                "code": "009",
                "bank_id": 9
            },
            {
                "name": "Hurlingham ",
                "code": "010",
                "bank_id": 9
            },
            {
                "name": "Capital Centre ",
                "code": "011",
                "bank_id": 9
            },
            {
                "name": "Nyali ",
                "code": "012",
                "bank_id": 9
            },
            {
                "name": "Kamukunji ",
                "code": "014",
                "bank_id": 9
            },
            {
                "name": "Eldoret",
                "code": "015",
                "bank_id": 9
            },
            {
                "name": "Karen ",
                "code": "016",
                "bank_id": 9
            },
            {
                "name": "Nakuru ",
                "code": "017",
                "bank_id": 9
            }
        ]
    },
    {
        "id": 10,
        "name": "Co-operative Bank of Kenya Limited",
        "code": "11",
        "paybill": "400200",
        "branches": [
            {
                "name": "Head Office ",
                "code": "000",
                "bank_id": 10
            },
            {
                "name": "Finance And Accounts ",
                "code": "001",
                "bank_id": 10
            },
            {
                "name": "Co-op House ",
                "code": "002",
                "bank_id": 10
            },
            {
                "name": "Kisumu ",
                "code": "003",
                "bank_id": 10
            },
            {
                "name": "Nkurumah Road",
                "code": "004",
                "bank_id": 10
            },
            {
                "name": "Meru ",
                "code": "005",
                "bank_id": 10
            },
            {
                "name": "Nakuru ",
                "code": "006",
                "bank_id": 10
            },
            {
                "name": "Industrial Area ",
                "code": "007",
                "bank_id": 10
            },
            {
                "name": "Kisii ",
                "code": "008",
                "bank_id": 10
            },
            {
                "name": "Machakos ",
                "code": "009",
                "bank_id": 10
            },
            {
                "name": "Nyeri ",
                "code": "010",
                "bank_id": 10
            },
            {
                "name": "Ukulima ",
                "code": "011",
                "bank_id": 10
            },
            {
                "name": "Kerugoya ",
                "code": "012",
                "bank_id": 10
            },
            {
                "name": "Eldoret ",
                "code": "013",
                "bank_id": 10
            },
            {
                "name": "Moi Avenue ",
                "code": "014",
                "bank_id": 10
            },
            {
                "name": "Naivasha ",
                "code": "015",
                "bank_id": 10
            },
            {
                "name": "Nyahururu ",
                "code": "017",
                "bank_id": 10
            },
            {
                "name": "Chuka ",
                "code": "018",
                "bank_id": 10
            },
            {
                "name": "Wakulima Market ",
                "code": "019",
                "bank_id": 10
            },
            {
                "name": "Eastleigh ",
                "code": "020",
                "bank_id": 10
            },
            {
                "name": "Kiambu ",
                "code": "021",
                "bank_id": 10
            },
            {
                "name": "Homa Bay ",
                "code": "022",
                "bank_id": 10
            },
            {
                "name": "Embu ",
                "code": "023",
                "bank_id": 10
            },
            {
                "name": "Kericho ",
                "code": "024",
                "bank_id": 10
            },
            {
                "name": "Bungoma ",
                "code": "025",
                "bank_id": 10
            },
            {
                "name": "Muranga ",
                "code": "026",
                "bank_id": 10
            },
            {
                "name": "Kayole ",
                "code": "027",
                "bank_id": 10
            },
            {
                "name": "Karatina ",
                "code": "028",
                "bank_id": 10
            },
            {
                "name": "Ukunda ",
                "code": "029",
                "bank_id": 10
            },
            {
                "name": "Mtwapa ",
                "code": "030",
                "bank_id": 10
            },
            {
                "name": "University Way ",
                "code": "031",
                "bank_id": 10
            },
            {
                "name": "Buru Buru ",
                "code": "032",
                "bank_id": 10
            },
            {
                "name": "Athi River ",
                "code": "033",
                "bank_id": 10
            },
            {
                "name": "Mumias ",
                "code": "034",
                "bank_id": 10
            },
            {
                "name": "Stima Plaza ",
                "code": "035",
                "bank_id": 10
            },
            {
                "name": "Westlands ",
                "code": "036",
                "bank_id": 10
            },
            {
                "name": "Upper Hill ",
                "code": "037",
                "bank_id": 10
            },
            {
                "name": "Ongata Rongai ",
                "code": "038",
                "bank_id": 10
            },
            {
                "name": "Thika ",
                "code": "039",
                "bank_id": 10
            },
            {
                "name": "Nacico ",
                "code": "040",
                "bank_id": 10
            },
            {
                "name": "Kariobangi ",
                "code": "041",
                "bank_id": 10
            },
            {
                "name": "Kawangware ",
                "code": "042",
                "bank_id": 10
            },
            {
                "name": "Makutano ",
                "code": "043",
                "bank_id": 10
            },
            {
                "name": "Canon House ",
                "code": "044",
                "bank_id": 10
            },
            {
                "name": "Kimathi Street ",
                "code": "045",
                "bank_id": 10
            },
            {
                "name": "Kitale ",
                "code": "046",
                "bank_id": 10
            },
            {
                "name": "Githurai ",
                "code": "047",
                "bank_id": 10
            },
            {
                "name": "Maua ",
                "code": "048",
                "bank_id": 10
            },
            {
                "name": "City  Hall ",
                "code": "049",
                "bank_id": 10
            },
            {
                "name": "Digo Rd ",
                "code": "050",
                "bank_id": 10
            },
            {
                "name": "Nairobi Business Centre",
                "code": "051",
                "bank_id": 10
            },
            {
                "name": "Kakamega",
                "code": "052",
                "bank_id": 10
            },
            {
                "name": "Migori ",
                "code": "053",
                "bank_id": 10
            },
            {
                "name": "Kenyatta Avenue ",
                "code": "054",
                "bank_id": 10
            },
            {
                "name": "Nkubu ",
                "code": "055",
                "bank_id": 10
            },
            {
                "name": "Enterprise Road ",
                "code": "056",
                "bank_id": 10
            },
            {
                "name": "Busia ",
                "code": "057",
                "bank_id": 10
            },
            {
                "name": "Siaya ",
                "code": "058",
                "bank_id": 10
            },
            {
                "name": "Voi ",
                "code": "059",
                "bank_id": 10
            },
            {
                "name": "Mariakani ",
                "code": "060",
                "bank_id": 10
            },
            {
                "name": "Malindi ",
                "code": "061",
                "bank_id": 10
            },
            {
                "name": "Zimmerman ",
                "code": "062",
                "bank_id": 10
            },
            {
                "name": "Nakuru East ",
                "code": "063",
                "bank_id": 10
            },
            {
                "name": "Kitengela ",
                "code": "064",
                "bank_id": 10
            },
            {
                "name": "Aga Khan Walk ",
                "code": "065",
                "bank_id": 10
            },
            {
                "name": "Narok ",
                "code": "066",
                "bank_id": 10
            },
            {
                "name": "Kitui ",
                "code": "067",
                "bank_id": 10
            },
            {
                "name": "Nanyuki ",
                "code": "068",
                "bank_id": 10
            },
            {
                "name": "Embakasi ",
                "code": "069",
                "bank_id": 10
            },
            {
                "name": "Kibera ",
                "code": "070",
                "bank_id": 10
            },
            {
                "name": "Siakago ",
                "code": "071",
                "bank_id": 10
            },
            {
                "name": "Kapsabet ",
                "code": "072",
                "bank_id": 10
            },
            {
                "name": "Mbita ",
                "code": "073",
                "bank_id": 10
            },
            {
                "name": "Kangemi ",
                "code": "074",
                "bank_id": 10
            },
            {
                "name": "Dandora ",
                "code": "075",
                "bank_id": 10
            },
            {
                "name": "Kajiado ",
                "code": "076",
                "bank_id": 10
            },
            {
                "name": "Tala ",
                "code": "077",
                "bank_id": 10
            },
            {
                "name": "Gikomba ",
                "code": "078",
                "bank_id": 10
            },
            {
                "name": "River Road ",
                "code": "079",
                "bank_id": 10
            },
            {
                "name": "Nyamira ",
                "code": "080",
                "bank_id": 10
            },
            {
                "name": "Garisa ",
                "code": "081",
                "bank_id": 10
            },
            {
                "name": "Bomet ",
                "code": "082",
                "bank_id": 10
            },
            {
                "name": "Keroka ",
                "code": "083",
                "bank_id": 10
            },
            {
                "name": "Gilgil ",
                "code": "084",
                "bank_id": 10
            },
            {
                "name": "Tom Mboya ",
                "code": "085",
                "bank_id": 10
            },
            {
                "name": "Likoni ",
                "code": "086",
                "bank_id": 10
            },
            {
                "name": "Donholm ",
                "code": "087",
                "bank_id": 10
            },
            {
                "name": "Mwingi ",
                "code": "088",
                "bank_id": 10
            },
            {
                "name": "Ruaka",
                "code": "089",
                "bank_id": 10
            },
            {
                "name": "Webuye",
                "code": "090",
                "bank_id": 10
            },
            {
                "name": "clearing Centre",
                "code": "097",
                "bank_id": 10
            },
            {
                "name": "Ndhiwa",
                "code": "100",
                "bank_id": 10
            },
            {
                "name": "Oyugis",
                "code": "101",
                "bank_id": 10
            },
            {
                "name": "Isiolo",
                "code": "102",
                "bank_id": 10
            },
            {
                "name": "Eldoret West",
                "code": "103",
                "bank_id": 10
            },
            {
                "name": "Changamwe",
                "code": "104",
                "bank_id": 10
            },
            {
                "name": "Kisumu East",
                "code": "105",
                "bank_id": 10
            },
            {
                "name": "Githurai Kimbo",
                "code": "106",
                "bank_id": 10
            },
            {
                "name": "Mlolongo",
                "code": "107",
                "bank_id": 10
            },
            {
                "name": "Kilifi",
                "code": "108",
                "bank_id": 10
            },
            {
                "name": "Ol Kalau",
                "code": "109",
                "bank_id": 10
            },
            {
                "name": "Mbale",
                "code": "110",
                "bank_id": 10
            },
            {
                "name": "Kimilili",
                "code": "111",
                "bank_id": 10
            },
            {
                "name": "Kisii East",
                "code": "112",
                "bank_id": 10
            },
            {
                "name": "Kilgoris",
                "code": "113",
                "bank_id": 10
            },
            {
                "name": "Wote",
                "code": "114",
                "bank_id": 10
            },
            {
                "name": "Malaba",
                "code": "116",
                "bank_id": 10
            },
            {
                "name": "Molo",
                "code": "117",
                "bank_id": 10
            },
            {
                "name": "Mwea",
                "code": "118",
                "bank_id": 10
            },
            {
                "name": "Kutus",
                "code": "119",
                "bank_id": 10
            },
            {
                "name": "Embakasi Junction",
                "code": "121",
                "bank_id": 10
            },
            {
                "name": "Kongowea ",
                "code": "122",
                "bank_id": 10
            },
            {
                "name": "Langata Road",
                "code": "123",
                "bank_id": 10
            },
            {
                "name": "Ngong",
                "code": "125",
                "bank_id": 10
            },
            {
                "name": "Kawangware 46",
                "code": "126",
                "bank_id": 10
            },
            {
                "name": "Mombasa Road",
                "code": "127",
                "bank_id": 10
            },
            {
                "name": "Othaya",
                "code": "131",
                "bank_id": 10
            },
            {
                "name": "Limuru",
                "code": "132",
                "bank_id": 10
            },
            {
                "name": "Githunguri",
                "code": "134",
                "bank_id": 10
            },
            {
                "name": "Karen",
                "code": "135",
                "bank_id": 10
            },
            {
                "name": "Ruiru",
                "code": "138",
                "bank_id": 10
            },
            {
                "name": "Yala",
                "code": "140",
                "bank_id": 10
            },
            {
                "name": "Shares Operations ",
                "code": "228",
                "bank_id": 10
            },
            {
                "name": "Kilindini Port ",
                "code": "266",
                "bank_id": 10
            },
            {
                "name": "Money Transfers Agency ",
                "code": "270",
                "bank_id": 10
            },
            {
                "name": "Gigiri",
                "code": "151",
                "bank_id": 10
            },
            {
                "name": "Juja",
                "code": "124",
                "bank_id": 10
            },
            {
                "name": "Thika Road Mall",
                "code": "142",
                "bank_id": 10
            },
            {
                "name": "Green House Mall",
                "code": "153",
                "bank_id": 10
            },
            {
                "name": "Dagoretti",
                "code": "130",
                "bank_id": 10
            }
        ]
    },
    {
        "id": 11,
        "name": "National Bank of Kenya Limited",
        "code": "12",
        "paybill": null,
        "branches": [
            {
                "name": "Central Business Unit",
                "code": "000",
                "bank_id": 11
            },
            {
                "name": "Kenyatta",
                "code": "002",
                "bank_id": 11
            },
            {
                "name": "Harambee ",
                "code": "003",
                "bank_id": 11
            },
            {
                "name": "Hill ",
                "code": "004",
                "bank_id": 11
            },
            {
                "name": "Busia ",
                "code": "005",
                "bank_id": 11
            },
            {
                "name": "Kiambu",
                "code": "006",
                "bank_id": 11
            },
            {
                "name": "Meru ",
                "code": "007",
                "bank_id": 11
            },
            {
                "name": "Karatina ",
                "code": "008",
                "bank_id": 11
            },
            {
                "name": "Narok ",
                "code": "009",
                "bank_id": 11
            },
            {
                "name": "Kisii ",
                "code": "010",
                "bank_id": 11
            },
            {
                "name": "Malindi ",
                "code": "011",
                "bank_id": 11
            },
            {
                "name": "Nyeri ",
                "code": "012",
                "bank_id": 11
            },
            {
                "name": "Kitale ",
                "code": "013",
                "bank_id": 11
            },
            {
                "name": "Eastleigh",
                "code": "015",
                "bank_id": 11
            },
            {
                "name": "Limuru ",
                "code": "016",
                "bank_id": 11
            },
            {
                "name": "Kitui ",
                "code": "017",
                "bank_id": 11
            },
            {
                "name": "Molo ",
                "code": "018",
                "bank_id": 11
            },
            {
                "name": "Bungoma ",
                "code": "019",
                "bank_id": 11
            },
            {
                "name": "Nkrumah",
                "code": "020",
                "bank_id": 11
            },
            {
                "name": "Kapsabet ",
                "code": "021",
                "bank_id": 11
            },
            {
                "name": "Awendo ",
                "code": "022",
                "bank_id": 11
            },
            {
                "name": "Portway-msa ",
                "code": "023",
                "bank_id": 11
            },
            {
                "name": "Hospital Br. ",
                "code": "025",
                "bank_id": 11
            },
            {
                "name": "Ruiru ",
                "code": "026",
                "bank_id": 11
            },
            {
                "name": "Ongata Rongai ",
                "code": "027",
                "bank_id": 11
            },
            {
                "name": "Embu ",
                "code": "028",
                "bank_id": 11
            },
            {
                "name": "Kakamega ",
                "code": "029",
                "bank_id": 11
            },
            {
                "name": "Nakuru ",
                "code": "030",
                "bank_id": 11
            },
            {
                "name": "Ukunda ",
                "code": "031",
                "bank_id": 11
            },
            {
                "name": "Upper Hill ",
                "code": "032",
                "bank_id": 11
            },
            {
                "name": "Nandi Hills ",
                "code": "033",
                "bank_id": 11
            },
            {
                "name": "Migori ",
                "code": "034",
                "bank_id": 11
            },
            {
                "name": "Westlands ",
                "code": "035",
                "bank_id": 11
            },
            {
                "name": "Times Tower",
                "code": "036",
                "bank_id": 11
            },
            {
                "name": "Maua",
                "code": "037",
                "bank_id": 11
            },
            {
                "name": "WILSON AIRPORT",
                "code": "038",
                "bank_id": 11
            },
            {
                "name": "J.K.I.A.",
                "code": "039",
                "bank_id": 11
            },
            {
                "name": "Eldoret ",
                "code": "040",
                "bank_id": 11
            },
            {
                "name": "MOIS BRIDGE",
                "code": "041",
                "bank_id": 11
            },
            {
                "name": "MUTOMO",
                "code": "042",
                "bank_id": 11
            },
            {
                "name": "KIANJAI",
                "code": "043",
                "bank_id": 11
            },
            {
                "name": "KENYATTA UNIVERSITY",
                "code": "044",
                "bank_id": 11
            },
            {
                "name": "ST PAULS UNIVERSITY",
                "code": "045",
                "bank_id": 11
            },
            {
                "name": "MOI UNIVERSITY ELDORET",
                "code": "046",
                "bank_id": 11
            },
            {
                "name": "MOI INT AIRPORT MOMBASA",
                "code": "047",
                "bank_id": 11
            },
            {
                "name": "Machakos",
                "code": "048",
                "bank_id": 11
            },
            {
                "name": "Kitengela",
                "code": "049",
                "bank_id": 11
            },
            {
                "name": "Kisumu ",
                "code": "050",
                "bank_id": 11
            },
            {
                "name": "Mtwapa",
                "code": "051",
                "bank_id": 11
            },
            {
                "name": "Changamwe",
                "code": "052",
                "bank_id": 11
            },
            {
                "name": "Garissa",
                "code": "053",
                "bank_id": 11
            },
            {
                "name": "Thika",
                "code": "054",
                "bank_id": 11
            },
            {
                "name": "Momasa Polytechnic University College",
                "code": "055",
                "bank_id": 11
            },
            {
                "name": "Bomet",
                "code": "056",
                "bank_id": 11
            },
            {
                "name": "SEKU",
                "code": "060",
                "bank_id": 11
            },
            {
                "name": "Card Centre ",
                "code": "098",
                "bank_id": 11
            },
            {
                "name": "Head Office",
                "code": "099",
                "bank_id": 11
            },
            {
                "name": "Central CLearing Centre",
                "code": "198",
                "bank_id": 11
            },
            {
                "name": "NGONG ROAD",
                "code": "061",
                "bank_id": 11
            },
            {
                "name": "Kenyatta Ave Amanah",
                "code": "203",
                "bank_id": 11
            },
            {
                "name": "Moi Avenue",
                "code": "062",
                "bank_id": 11
            }
        ]
    },
    {
        "id": 12,
        "name": "Oriental Commercial Bank Limited",
        "code": "14",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office ",
                "code": "000",
                "bank_id": 12
            },
            {
                "name": "Koinange Street ",
                "code": "001",
                "bank_id": 12
            },
            {
                "name": "Nakuru ",
                "code": "003",
                "bank_id": 12
            },
            {
                "name": "Nakuru ",
                "code": "004",
                "bank_id": 12
            },
            {
                "name": "Eldoret ",
                "code": "005",
                "bank_id": 12
            },
            {
                "name": "Kitale ",
                "code": "006",
                "bank_id": 12
            },
            {
                "name": "Westlands ",
                "code": "007",
                "bank_id": 12
            },
            {
                "name": "Nakumatt Mega",
                "code": "008",
                "bank_id": 12
            }
        ]
    },
    {
        "id": 13,
        "name": "Citibank N.A.",
        "code": "16",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office - Nairobi ",
                "code": "000",
                "bank_id": 13
            },
            {
                "name": "Mombasa ",
                "code": "400",
                "bank_id": 13
            },
            {
                "name": "Gigiri Agency ",
                "code": "500",
                "bank_id": 13
            },
            {
                "name": "Kisumu ",
                "code": "700",
                "bank_id": 13
            }
        ]
    },
    {
        "id": 14,
        "name": "Habib Bank A.G. Zurich",
        "code": "17",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office ",
                "code": "000",
                "bank_id": 14
            },
            {
                "name": "Mombasa ",
                "code": "001",
                "bank_id": 14
            },
            {
                "name": "Industrial Area ",
                "code": "002",
                "bank_id": 14
            },
            {
                "name": "Westlands ",
                "code": "003",
                "bank_id": 14
            }
        ]
    },
    {
        "id": 15,
        "name": "Middle East Bank Kenya Limited",
        "code": "18",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office ",
                "code": "000",
                "bank_id": 15
            },
            {
                "name": "Nairobi ",
                "code": "001",
                "bank_id": 15
            },
            {
                "name": "Mombasa ",
                "code": "002",
                "bank_id": 15
            },
            {
                "name": "Milimani ",
                "code": "003",
                "bank_id": 15
            },
            {
                "name": "Industrial Area",
                "code": "004",
                "bank_id": 15
            }
        ]
    },
    {
        "id": 16,
        "name": "Bank of  Africa Kenya Limited",
        "code": "19",
        "paybill": null,
        "branches": [
            {
                "name": "Reinsurance Plaza Nairobi ",
                "code": "000",
                "bank_id": 16
            },
            {
                "name": "Mombasa ",
                "code": "001",
                "bank_id": 16
            },
            {
                "name": "Westlands ",
                "code": "002",
                "bank_id": 16
            },
            {
                "name": "Uhuru Highway ",
                "code": "003",
                "bank_id": 16
            },
            {
                "name": "River Road ",
                "code": "004",
                "bank_id": 16
            },
            {
                "name": "Thika ",
                "code": "005",
                "bank_id": 16
            },
            {
                "name": "Kisumu ",
                "code": "006",
                "bank_id": 16
            },
            {
                "name": "Ruaraka ",
                "code": "007",
                "bank_id": 16
            },
            {
                "name": "Monrovia Street ",
                "code": "008",
                "bank_id": 16
            },
            {
                "name": "Nakuru ",
                "code": "009",
                "bank_id": 16
            },
            {
                "name": "Ngong Road ",
                "code": "010",
                "bank_id": 16
            },
            {
                "name": "Eldoret ",
                "code": "011",
                "bank_id": 16
            },
            {
                "name": "Embakasi ",
                "code": "012",
                "bank_id": 16
            },
            {
                "name": "Kericho ",
                "code": "013",
                "bank_id": 16
            },
            {
                "name": "Ongata Rongai",
                "code": "014",
                "bank_id": 16
            },
            {
                "name": "Changamwe",
                "code": "015",
                "bank_id": 16
            },
            {
                "name": "Bungoma",
                "code": "016",
                "bank_id": 16
            },
            {
                "name": "KISII",
                "code": "017",
                "bank_id": 16
            },
            {
                "name": "MERU",
                "code": "018",
                "bank_id": 16
            },
            {
                "name": "Kitengela",
                "code": "019",
                "bank_id": 16
            },
            {
                "name": "Nyali",
                "code": "020",
                "bank_id": 16
            },
            {
                "name": "Galleria",
                "code": "021",
                "bank_id": 16
            },
            {
                "name": "Greenspan Mall",
                "code": "022",
                "bank_id": 16
            },
            {
                "name": "Upper Hilll",
                "code": "023",
                "bank_id": 16
            },
            {
                "name": "Nanyuki",
                "code": "024",
                "bank_id": 16
            },
            {
                "name": "Lunga Lunga Road",
                "code": "025",
                "bank_id": 16
            },
            {
                "name": "Kenyatta Avenue",
                "code": "026",
                "bank_id": 16
            }
        ]
    },
    {
        "id": 17,
        "name": "Dubai Bank Kenya Limited",
        "code": "20",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office ",
                "code": "000",
                "bank_id": 17
            },
            {
                "name": "Eastleigh ",
                "code": "001",
                "bank_id": 17
            },
            {
                "name": "Mombasa ",
                "code": "002",
                "bank_id": 17
            },
            {
                "name": "Mombasa ",
                "code": "003",
                "bank_id": 17
            },
            {
                "name": "Nakuru ",
                "code": "004",
                "bank_id": 17
            },
            {
                "name": "Nakuru ",
                "code": "020",
                "bank_id": 17
            }
        ]
    },
    {
        "id": 18,
        "name": "Consolidated Bank of Kenya Limited",
        "code": "23",
        "paybill": null,
        "branches": [
            {
                "name": "Harambee Avenue ",
                "code": "000",
                "bank_id": 18
            },
            {
                "name": "Muranga ",
                "code": "001",
                "bank_id": 18
            },
            {
                "name": "Embu ",
                "code": "002",
                "bank_id": 18
            },
            {
                "name": "Mombasa ",
                "code": "003",
                "bank_id": 18
            },
            {
                "name": "Koinange Street ",
                "code": "004",
                "bank_id": 18
            },
            {
                "name": "Thika ",
                "code": "005",
                "bank_id": 18
            },
            {
                "name": "Meru ",
                "code": "006",
                "bank_id": 18
            },
            {
                "name": "Nyeri ",
                "code": "007",
                "bank_id": 18
            },
            {
                "name": "Laare",
                "code": "008",
                "bank_id": 18
            },
            {
                "name": "Maua ",
                "code": "009",
                "bank_id": 18
            },
            {
                "name": "Isiolo ",
                "code": "010",
                "bank_id": 18
            },
            {
                "name": "Head Office ",
                "code": "011",
                "bank_id": 18
            },
            {
                "name": "Umoja ",
                "code": "013",
                "bank_id": 18
            },
            {
                "name": "River Road ",
                "code": "014",
                "bank_id": 18
            },
            {
                "name": "Eldoret",
                "code": "015",
                "bank_id": 18
            },
            {
                "name": "Nakuru",
                "code": "016",
                "bank_id": 18
            },
            {
                "name": "Kitengela",
                "code": "017",
                "bank_id": 18
            },
            {
                "name": "Taj Mall",
                "code": "018",
                "bank_id": 18
            }
        ]
    },
    {
        "id": 19,
        "name": "Credit Bank Limited",
        "code": "25",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office",
                "code": "000",
                "bank_id": 19
            },
            {
                "name": "Koinange Street",
                "code": "001",
                "bank_id": 19
            },
            {
                "name": "Kisumu",
                "code": "002",
                "bank_id": 19
            },
            {
                "name": "Nakuru",
                "code": "003",
                "bank_id": 19
            },
            {
                "name": "Kisii",
                "code": "004",
                "bank_id": 19
            },
            {
                "name": "Westlands ",
                "code": "005",
                "bank_id": 19
            },
            {
                "name": "Industrial Area ",
                "code": "006",
                "bank_id": 19
            },
            {
                "name": "Nakuru- Kenyatta Avenue",
                "code": "008",
                "bank_id": 19
            },
            {
                "name": "Eldoret",
                "code": "009",
                "bank_id": 19
            },
            {
                "name": "Ngong Rd",
                "code": "016",
                "bank_id": 19
            }
        ]
    },
    {
        "id": 20,
        "name": "Trans-National Bank Limited",
        "code": "26",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office ",
                "code": "001",
                "bank_id": 20
            },
            {
                "name": "Mombasa ",
                "code": "002",
                "bank_id": 20
            },
            {
                "name": "Eldoret ",
                "code": "003",
                "bank_id": 20
            },
            {
                "name": "Nakuru ",
                "code": "004",
                "bank_id": 20
            },
            {
                "name": "Mia ",
                "code": "005",
                "bank_id": 20
            },
            {
                "name": "Jkia ",
                "code": "006",
                "bank_id": 20
            },
            {
                "name": "Kirinyaga Rd Nakuru ",
                "code": "007",
                "bank_id": 20
            },
            {
                "name": "Kabarak ",
                "code": "008",
                "bank_id": 20
            },
            {
                "name": "Olenguruone ",
                "code": "009",
                "bank_id": 20
            },
            {
                "name": "Kericho ",
                "code": "010",
                "bank_id": 20
            },
            {
                "name": "Nandi Hills",
                "code": "011",
                "bank_id": 20
            },
            {
                "name": "Epz ",
                "code": "012",
                "bank_id": 20
            },
            {
                "name": "Nandi Hills ",
                "code": "013",
                "bank_id": 20
            },
            {
                "name": "Kabarnet ",
                "code": "014",
                "bank_id": 20
            },
            {
                "name": "Kitale",
                "code": "015",
                "bank_id": 20
            },
            {
                "name": "Narok",
                "code": "016",
                "bank_id": 20
            }
        ]
    },
    {
        "id": 21,
        "name": "Chase Bank Limited",
        "code": "98",
        "paybill": "552800",
        "branches": [
            {
                "name": "Head Office",
                "code": "000",
                "bank_id": 21
            },
            {
                "name": "City Centre Branch",
                "code": "001",
                "bank_id": 21
            },
            {
                "name": "Village Market ",
                "code": "003",
                "bank_id": 21
            },
            {
                "name": "Mombasa Moi Avenue",
                "code": "004",
                "bank_id": 21
            },
            {
                "name": "Hurlingham ",
                "code": "005",
                "bank_id": 21
            },
            {
                "name": "Eastleigh ",
                "code": "006",
                "bank_id": 21
            },
            {
                "name": "Parklands ",
                "code": "007",
                "bank_id": 21
            },
            {
                "name": "Riverside Mews ",
                "code": "008",
                "bank_id": 21
            },
            {
                "name": "Thika ",
                "code": "010",
                "bank_id": 21
            },
            {
                "name": "Nakuru ",
                "code": "011",
                "bank_id": 21
            },
            {
                "name": "Donholm ",
                "code": "012",
                "bank_id": 21
            },
            {
                "name": "Bondeni Chase Iman ",
                "code": "013",
                "bank_id": 21
            },
            {
                "name": "Ngara Mini ",
                "code": "014",
                "bank_id": 21
            },
            {
                "name": "Kisumu ",
                "code": "015",
                "bank_id": 21
            },
            {
                "name": "Eldoret",
                "code": "016",
                "bank_id": 21
            },
            {
                "name": "Diamond Plaza",
                "code": "017",
                "bank_id": 21
            },
            {
                "name": "Windsor",
                "code": "018",
                "bank_id": 21
            },
            {
                "name": "Malindi",
                "code": "019",
                "bank_id": 21
            },
            {
                "name": "Embakasi",
                "code": "020",
                "bank_id": 21
            },
            {
                "name": "Upper Hill",
                "code": "021",
                "bank_id": 21
            },
            {
                "name": "Nyali",
                "code": "022",
                "bank_id": 21
            },
            {
                "name": "Buru Buru",
                "code": "023",
                "bank_id": 21
            },
            {
                "name": "Strathmore",
                "code": "024",
                "bank_id": 21
            },
            {
                "name": "Kisii",
                "code": "025",
                "bank_id": 21
            },
            {
                "name": "Virtual ",
                "code": "026",
                "bank_id": 21
            },
            {
                "name": "Rafiki DTM Clearing Center",
                "code": "027",
                "bank_id": 21
            },
            {
                "name": "Chase Xpress - Ngong Road",
                "code": "028",
                "bank_id": 21
            },
            {
                "name": "Chase Elite ABC Place",
                "code": "029",
                "bank_id": 21
            },
            {
                "name": "Sameer Business Park",
                "code": "030",
                "bank_id": 21
            },
            {
                "name": "Mtwapa",
                "code": "031",
                "bank_id": 21
            }
        ]
    },
    {
        "id": 22,
        "name": "Stanbic Bank Kenya Limited",
        "code": "31",
        "paybill": "600100",
        "branches": [
            {
                "name": "CFC Stanbic Head Office",
                "code": "000",
                "bank_id": 22
            },
            {
                "name": "Kenyatta Ave ",
                "code": "002",
                "bank_id": 22
            },
            {
                "name": "Digo road",
                "code": "003",
                "bank_id": 22
            },
            {
                "name": "Waiyaki Way ",
                "code": "004",
                "bank_id": 22
            },
            {
                "name": "Industrial Area ",
                "code": "005",
                "bank_id": 22
            },
            {
                "name": "Harambee Avenue ",
                "code": "006",
                "bank_id": 22
            },
            {
                "name": "Chiromo Road ",
                "code": "007",
                "bank_id": 22
            },
            {
                "name": "International House ",
                "code": "008",
                "bank_id": 22
            },
            {
                "name": "Upper Hill",
                "code": "010",
                "bank_id": 22
            },
            {
                "name": "Naivasha ",
                "code": "011",
                "bank_id": 22
            },
            {
                "name": "Wesgate ",
                "code": "012",
                "bank_id": 22
            },
            {
                "name": "Kisumu ",
                "code": "013",
                "bank_id": 22
            },
            {
                "name": "Nakuru ",
                "code": "014",
                "bank_id": 22
            },
            {
                "name": "Thika ",
                "code": "015",
                "bank_id": 22
            },
            {
                "name": "Nanyuki ",
                "code": "017",
                "bank_id": 22
            },
            {
                "name": "Meru",
                "code": "018",
                "bank_id": 22
            },
            {
                "name": "Buruburu",
                "code": "019",
                "bank_id": 22
            },
            {
                "name": "Gikomba",
                "code": "020",
                "bank_id": 22
            },
            {
                "name": "Ruaraka ",
                "code": "021",
                "bank_id": 22
            },
            {
                "name": "ELDORET",
                "code": "022",
                "bank_id": 22
            },
            {
                "name": "KAREN",
                "code": "023",
                "bank_id": 22
            },
            {
                "name": "Kisii",
                "code": "024",
                "bank_id": 22
            },
            {
                "name": "Warwick",
                "code": "025",
                "bank_id": 22
            },
            {
                "name": "Private Clients",
                "code": "026",
                "bank_id": 22
            },
            {
                "name": "Central Processing H\/o ",
                "code": "999",
                "bank_id": 22
            }
        ]
    },
    {
        "id": 23,
        "name": "African Banking Corp. Bank Ltd",
        "code": "35",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office\/koinange St. ",
                "code": "000",
                "bank_id": 23
            },
            {
                "name": "Westlands",
                "code": "001",
                "bank_id": 23
            },
            {
                "name": "Industrial Area Branch ",
                "code": "002",
                "bank_id": 23
            },
            {
                "name": "Nkrumah Road Branch\/mombasa ",
                "code": "003",
                "bank_id": 23
            },
            {
                "name": "Kisumu Branch ",
                "code": "004",
                "bank_id": 23
            },
            {
                "name": "Eldoret Branch",
                "code": "005",
                "bank_id": 23
            },
            {
                "name": "Meru Branch ",
                "code": "006",
                "bank_id": 23
            },
            {
                "name": "Libra House ",
                "code": "007",
                "bank_id": 23
            },
            {
                "name": "Nakuru",
                "code": "008",
                "bank_id": 23
            },
            {
                "name": "Lamu",
                "code": "009",
                "bank_id": 23
            }
        ]
    },
    {
        "id": 24,
        "name": "Imperial Bank Limited",
        "code": "39",
        "paybill": null,
        "branches": [
            {
                "name": "IPS",
                "code": "001",
                "bank_id": 24
            },
            {
                "name": "Mombasa ",
                "code": "002",
                "bank_id": 24
            },
            {
                "name": "Upper Hill ",
                "code": "003",
                "bank_id": 24
            },
            {
                "name": "Parklands ",
                "code": "004",
                "bank_id": 24
            },
            {
                "name": "Malindi ",
                "code": "005",
                "bank_id": 24
            },
            {
                "name": "Industrial Area ",
                "code": "006",
                "bank_id": 24
            },
            {
                "name": "Watamu ",
                "code": "007",
                "bank_id": 24
            },
            {
                "name": "Diani ",
                "code": "008",
                "bank_id": 24
            },
            {
                "name": "Kilifi ",
                "code": "009",
                "bank_id": 24
            },
            {
                "name": "Eldoret ",
                "code": "010",
                "bank_id": 24
            },
            {
                "name": "Karen ",
                "code": "011",
                "bank_id": 24
            },
            {
                "name": "Thika ",
                "code": "012",
                "bank_id": 24
            },
            {
                "name": "Changamwe ",
                "code": "014",
                "bank_id": 24
            },
            {
                "name": "Riverside ",
                "code": "015",
                "bank_id": 24
            },
            {
                "name": "Likoni ",
                "code": "016",
                "bank_id": 24
            },
            {
                "name": "HAILE SELASSIE ROAD",
                "code": "017",
                "bank_id": 24
            },
            {
                "name": "Village Market",
                "code": "018",
                "bank_id": 24
            },
            {
                "name": "Bamburi",
                "code": "019",
                "bank_id": 24
            },
            {
                "name": "Junction Mall",
                "code": "020",
                "bank_id": 24
            },
            {
                "name": "Greenspan mall",
                "code": "021",
                "bank_id": 24
            },
            {
                "name": "Westside Mall",
                "code": "022",
                "bank_id": 24
            },
            {
                "name": "Kenyatta Street Eldoret",
                "code": "023",
                "bank_id": 24
            },
            {
                "name": "Westlands",
                "code": "024",
                "bank_id": 24
            }
        ]
    },
    {
        "id": 25,
        "name": "NIC Bank Limited",
        "code": "41",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office",
                "code": "000",
                "bank_id": 25
            },
            {
                "name": "City Centre",
                "code": "101",
                "bank_id": 25
            },
            {
                "name": "NIC House",
                "code": "102",
                "bank_id": 25
            },
            {
                "name": "Harbour House ",
                "code": "103",
                "bank_id": 25
            },
            {
                "name": "Head Office-Fargo",
                "code": "104",
                "bank_id": 25
            },
            {
                "name": "Westlands ",
                "code": "105",
                "bank_id": 25
            },
            {
                "name": "The Junction Br. ",
                "code": "106",
                "bank_id": 25
            },
            {
                "name": "Nakuru ",
                "code": "107",
                "bank_id": 25
            },
            {
                "name": "Nyali ",
                "code": "108",
                "bank_id": 25
            },
            {
                "name": "Nkrumah Road ",
                "code": "109",
                "bank_id": 25
            },
            {
                "name": "Harambee ",
                "code": "110",
                "bank_id": 25
            },
            {
                "name": "Prestige - Ngong Road ",
                "code": "111",
                "bank_id": 25
            },
            {
                "name": "Kisumu ",
                "code": "112",
                "bank_id": 25
            },
            {
                "name": "Thika ",
                "code": "113",
                "bank_id": 25
            },
            {
                "name": "Meru",
                "code": "114",
                "bank_id": 25
            },
            {
                "name": "Galleria (bomas ",
                "code": "115",
                "bank_id": 25
            },
            {
                "name": "ELDORET",
                "code": "116",
                "bank_id": 25
            },
            {
                "name": "VILLAGE MARKET",
                "code": "117",
                "bank_id": 25
            },
            {
                "name": "SAMEER PARK",
                "code": "118",
                "bank_id": 25
            },
            {
                "name": "Karen",
                "code": "119",
                "bank_id": 25
            },
            {
                "name": "Taj Mall",
                "code": "121",
                "bank_id": 25
            },
            {
                "name": "ABC",
                "code": "122",
                "bank_id": 25
            },
            {
                "name": "Thika Road Mall ",
                "code": "123",
                "bank_id": 25
            },
            {
                "name": "Kenyatta Avenue",
                "code": "125",
                "bank_id": 25
            }
        ]
    },
    {
        "id": 26,
        "name": "Giro Commercial Bank Limited",
        "code": "42",
        "paybill": null,
        "branches": [
            {
                "name": "Banda",
                "code": "000",
                "bank_id": 26
            },
            {
                "name": "Mombasa ",
                "code": "001",
                "bank_id": 26
            },
            {
                "name": "Industrial Area ",
                "code": "002",
                "bank_id": 26
            },
            {
                "name": "Kimathi St.",
                "code": "003",
                "bank_id": 26
            },
            {
                "name": "Kisumu Branch ",
                "code": "004",
                "bank_id": 26
            },
            {
                "name": "Westlands ",
                "code": "005",
                "bank_id": 26
            },
            {
                "name": "Parklands 3rd Avenue ",
                "code": "007",
                "bank_id": 26
            }
        ]
    },
    {
        "id": 27,
        "name": "ECO Bank Limited",
        "code": "43",
        "paybill": null,
        "branches": [
            {
                "name": "Fedha Branch - Head Office ",
                "code": "000",
                "bank_id": 27
            },
            {
                "name": "Moi Avenue Nairobi ",
                "code": "001",
                "bank_id": 27
            },
            {
                "name": "Akiba Hse Mombasa ",
                "code": "002",
                "bank_id": 27
            },
            {
                "name": "Plaza 2000 ",
                "code": "003",
                "bank_id": 27
            },
            {
                "name": "Westminister ",
                "code": "004",
                "bank_id": 27
            },
            {
                "name": "Chambers ",
                "code": "005",
                "bank_id": 27
            },
            {
                "name": "Thika ",
                "code": "006",
                "bank_id": 27
            },
            {
                "name": "Eldoret ",
                "code": "007",
                "bank_id": 27
            },
            {
                "name": "Kisumu ",
                "code": "008",
                "bank_id": 27
            },
            {
                "name": "Kisii ",
                "code": "009",
                "bank_id": 27
            },
            {
                "name": "Kitale ",
                "code": "010",
                "bank_id": 27
            },
            {
                "name": "Industrial Area ",
                "code": "011",
                "bank_id": 27
            },
            {
                "name": "Karatina ",
                "code": "012",
                "bank_id": 27
            },
            {
                "name": "Westlands ",
                "code": "013",
                "bank_id": 27
            },
            {
                "name": "United Mall ",
                "code": "014",
                "bank_id": 27
            },
            {
                "name": "Nakuru ",
                "code": "015",
                "bank_id": 27
            },
            {
                "name": "Jomo Kenyatta Avenue ",
                "code": "016",
                "bank_id": 27
            },
            {
                "name": "Nyeri ",
                "code": "017",
                "bank_id": 27
            },
            {
                "name": "Busia ",
                "code": "018",
                "bank_id": 27
            },
            {
                "name": "Malindi ",
                "code": "019",
                "bank_id": 27
            },
            {
                "name": "Meru",
                "code": "020",
                "bank_id": 27
            },
            {
                "name": "Gikomba",
                "code": "021",
                "bank_id": 27
            },
            {
                "name": "UpperHill",
                "code": "022",
                "bank_id": 27
            },
            {
                "name": "Valley Arcade",
                "code": "023",
                "bank_id": 27
            },
            {
                "name": "Karen",
                "code": "024",
                "bank_id": 27
            },
            {
                "name": "Nyali Mombasa",
                "code": "025",
                "bank_id": 27
            },
            {
                "name": "Head Office ",
                "code": "100",
                "bank_id": 27
            }
        ]
    },
    {
        "id": 28,
        "name": "Equatorial Commercial Bank Limited",
        "code": "49",
        "paybill": null,
        "branches": [
            {
                "name": "Nairobi ",
                "code": "000",
                "bank_id": 28
            },
            {
                "name": "Nyerere ",
                "code": "001",
                "bank_id": 28
            },
            {
                "name": "Mombasa ",
                "code": "002",
                "bank_id": 28
            },
            {
                "name": "Westlands ",
                "code": "003",
                "bank_id": 28
            },
            {
                "name": "Mombasa Road ",
                "code": "004",
                "bank_id": 28
            },
            {
                "name": "Chester ",
                "code": "005",
                "bank_id": 28
            },
            {
                "name": "Waiyaki Way ",
                "code": "007",
                "bank_id": 28
            },
            {
                "name": "Kakamega ",
                "code": "008",
                "bank_id": 28
            },
            {
                "name": "Eldoret ",
                "code": "009",
                "bank_id": 28
            },
            {
                "name": "Senator Cards",
                "code": "010",
                "bank_id": 28
            },
            {
                "name": "Nyali ",
                "code": "011",
                "bank_id": 28
            },
            {
                "name": "Kisumu ",
                "code": "012",
                "bank_id": 28
            },
            {
                "name": "Industrial Area ",
                "code": "013",
                "bank_id": 28
            },
            {
                "name": "Nakuru",
                "code": "015",
                "bank_id": 28
            }
        ]
    },
    {
        "id": 29,
        "name": "Paramount Universal Bank Limited",
        "code": "50",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office ",
                "code": "000",
                "bank_id": 29
            },
            {
                "name": "Westlands ",
                "code": "001",
                "bank_id": 29
            },
            {
                "name": "Parklands ",
                "code": "002",
                "bank_id": 29
            },
            {
                "name": "Koinange Street ",
                "code": "003",
                "bank_id": 29
            },
            {
                "name": "Mombasa ",
                "code": "004",
                "bank_id": 29
            }
        ]
    },
    {
        "id": 30,
        "name": "Jamii Bora Bank",
        "code": "51",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office ",
                "code": "000",
                "bank_id": 30
            },
            {
                "name": "Koinange Street",
                "code": "001",
                "bank_id": 30
            },
            {
                "name": "Kiongozi",
                "code": "100",
                "bank_id": 30
            },
            {
                "name": "Kayole",
                "code": "101",
                "bank_id": 30
            },
            {
                "name": "Mathare",
                "code": "102",
                "bank_id": 30
            },
            {
                "name": "Kawangware",
                "code": "105",
                "bank_id": 30
            },
            {
                "name": "Kibera",
                "code": "106",
                "bank_id": 30
            },
            {
                "name": "Kariobangi",
                "code": "107",
                "bank_id": 30
            },
            {
                "name": "Funzi Road",
                "code": "114",
                "bank_id": 30
            },
            {
                "name": "Thika",
                "code": "301",
                "bank_id": 30
            },
            {
                "name": "Kikuyu",
                "code": "306",
                "bank_id": 30
            },
            {
                "name": "Banana",
                "code": "307",
                "bank_id": 30
            },
            {
                "name": "Kisumu",
                "code": "402",
                "bank_id": 30
            },
            {
                "name": "Ongata Rongai",
                "code": "502",
                "bank_id": 30
            },
            {
                "name": "Mombasa",
                "code": "603",
                "bank_id": 30
            },
            {
                "name": "Utawala",
                "code": "310",
                "bank_id": 30
            }
        ]
    },
    {
        "id": 31,
        "name": "Guaranty Trust Bank ( Kenya) Ltd.",
        "code": "53",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office",
                "code": "000",
                "bank_id": 31
            },
            {
                "name": "Kimathi Street",
                "code": "001",
                "bank_id": 31
            },
            {
                "name": "Ind Area ",
                "code": "002",
                "bank_id": 31
            },
            {
                "name": "Westlands ",
                "code": "003",
                "bank_id": 31
            },
            {
                "name": "Lavington ",
                "code": "004",
                "bank_id": 31
            },
            {
                "name": "Nkrumah Road - Mombasa ",
                "code": "005",
                "bank_id": 31
            },
            {
                "name": "Nakuru ",
                "code": "006",
                "bank_id": 31
            },
            {
                "name": "Eldoret ",
                "code": "007",
                "bank_id": 31
            },
            {
                "name": "Muthaiga ",
                "code": "008",
                "bank_id": 31
            },
            {
                "name": "Nanyuki ",
                "code": "009",
                "bank_id": 31
            },
            {
                "name": "Thika ",
                "code": "010",
                "bank_id": 31
            },
            {
                "name": "Gikomba ",
                "code": "011",
                "bank_id": 31
            },
            {
                "name": "Ngong Road ",
                "code": "012",
                "bank_id": 31
            },
            {
                "name": "Meru ",
                "code": "013",
                "bank_id": 31
            },
            {
                "name": "Nyali",
                "code": "014",
                "bank_id": 31
            },
            {
                "name": "Ngong Road",
                "code": "3012",
                "bank_id": 31
            },
            {
                "name": "Karen",
                "code": "016",
                "bank_id": 31
            }
        ]
    },
    {
        "id": 32,
        "name": "Victoria Commercial Bank Limited",
        "code": "54",
        "paybill": null,
        "branches": [
            {
                "name": "Victoria Towers- Upperhill",
                "code": "001",
                "bank_id": 32
            },
            {
                "name": "Riverside Drive",
                "code": "002",
                "bank_id": 32
            }
        ]
    },
    {
        "id": 33,
        "name": "Guardian Bank Limited",
        "code": "55",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office ",
                "code": "001",
                "bank_id": 33
            },
            {
                "name": "Westlands ",
                "code": "002",
                "bank_id": 33
            },
            {
                "name": "Mombasa ",
                "code": "003",
                "bank_id": 33
            },
            {
                "name": "Eldoret ",
                "code": "004",
                "bank_id": 33
            },
            {
                "name": "Kisumu ",
                "code": "005",
                "bank_id": 33
            },
            {
                "name": "Moi Ave ",
                "code": "006",
                "bank_id": 33
            },
            {
                "name": "Mombasa Road ",
                "code": "007",
                "bank_id": 33
            },
            {
                "name": "Nyali",
                "code": "008",
                "bank_id": 33
            },
            {
                "name": "Ngong Road",
                "code": "009",
                "bank_id": 33
            }
        ]
    },
    {
        "id": 34,
        "name": "I&M Bank",
        "code": "57",
        "paybill": "542542",
        "branches": [
            {
                "name": "Kenyatta Avenue ",
                "code": "000",
                "bank_id": 34
            },
            {
                "name": "2nd Nong Avenue ",
                "code": "001",
                "bank_id": 34
            },
            {
                "name": "Sarit Centre ",
                "code": "002",
                "bank_id": 34
            },
            {
                "name": "Head Office ",
                "code": "003",
                "bank_id": 34
            },
            {
                "name": "Biashara St ",
                "code": "004",
                "bank_id": 34
            },
            {
                "name": "Mombasa ",
                "code": "005",
                "bank_id": 34
            },
            {
                "name": "Industrial Area ",
                "code": "006",
                "bank_id": 34
            },
            {
                "name": "Kisumu ",
                "code": "007",
                "bank_id": 34
            },
            {
                "name": "Karen ",
                "code": "008",
                "bank_id": 34
            },
            {
                "name": "Panari Centre ",
                "code": "009",
                "bank_id": 34
            },
            {
                "name": "Parklands ",
                "code": "010",
                "bank_id": 34
            },
            {
                "name": "Wilson Airport ",
                "code": "011",
                "bank_id": 34
            },
            {
                "name": "Ongata Rongai ",
                "code": "012",
                "bank_id": 34
            },
            {
                "name": "South C Shopping Centre ",
                "code": "013",
                "bank_id": 34
            },
            {
                "name": "Nyali Cinemax ",
                "code": "014",
                "bank_id": 34
            },
            {
                "name": "Langata Link ",
                "code": "015",
                "bank_id": 34
            },
            {
                "name": "Valley Arcade",
                "code": "016",
                "bank_id": 34
            },
            {
                "name": "Eldoret ",
                "code": "017",
                "bank_id": 34
            },
            {
                "name": "NAKURU",
                "code": "018",
                "bank_id": 34
            },
            {
                "name": "Riversid Drive Branch",
                "code": "019",
                "bank_id": 34
            },
            {
                "name": "Kisii",
                "code": "020",
                "bank_id": 34
            },
            {
                "name": "Card Center ",
                "code": "098",
                "bank_id": 34
            },
            {
                "name": "Yaya",
                "code": "030",
                "bank_id": 34
            }
        ]
    },
    {
        "id": 35,
        "name": "Development Bank of Kenya Limited",
        "code": "59",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office ",
                "code": "000",
                "bank_id": 35
            },
            {
                "name": "Loita Street ",
                "code": "001",
                "bank_id": 35
            }
        ]
    },
    {
        "id": 36,
        "name": "Fidelity Commercial Bank Limited",
        "code": "97",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office ",
                "code": "000",
                "bank_id": 36
            },
            {
                "name": "City Centre ",
                "code": "001",
                "bank_id": 36
            },
            {
                "name": "Westlands ",
                "code": "002",
                "bank_id": 36
            },
            {
                "name": "Industrial Area ",
                "code": "003",
                "bank_id": 36
            },
            {
                "name": "Diani ",
                "code": "004",
                "bank_id": 36
            },
            {
                "name": "Malindi ",
                "code": "005",
                "bank_id": 36
            },
            {
                "name": "Mombasa ",
                "code": "006",
                "bank_id": 36
            },
            {
                "name": "Changamwe",
                "code": "007",
                "bank_id": 36
            },
            {
                "name": "Kilimani",
                "code": "008",
                "bank_id": 36
            },
            {
                "name": "New Muthaiga Branch",
                "code": "009",
                "bank_id": 36
            },
            {
                "name": "Nyali ",
                "code": "010",
                "bank_id": 36
            }
        ]
    },
    {
        "id": 37,
        "name": "Housing Finance Bank",
        "code": "61",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office",
                "code": "100",
                "bank_id": 37
            },
            {
                "name": "Rehani House",
                "code": "200",
                "bank_id": 37
            },
            {
                "name": "Kenyatta Market",
                "code": "210",
                "bank_id": 37
            },
            {
                "name": "Gill House",
                "code": "220",
                "bank_id": 37
            },
            {
                "name": "Buru Buru",
                "code": "230",
                "bank_id": 37
            },
            {
                "name": "Mombasa",
                "code": "300",
                "bank_id": 37
            },
            {
                "name": "Nakuru",
                "code": "400",
                "bank_id": 37
            },
            {
                "name": "Eldoret",
                "code": "410",
                "bank_id": 37
            },
            {
                "name": "Thika",
                "code": "500",
                "bank_id": 37
            },
            {
                "name": "Nyeri",
                "code": "510",
                "bank_id": 37
            },
            {
                "name": "Meru",
                "code": "520",
                "bank_id": 37
            },
            {
                "name": "Kisumu",
                "code": "600",
                "bank_id": 37
            },
            {
                "name": "Westands",
                "code": "280",
                "bank_id": 37
            }
        ]
    },
    {
        "id": 38,
        "name": "Diamond Trust Bank Limited",
        "code": "63",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office ",
                "code": "000",
                "bank_id": 38
            },
            {
                "name": "Nation Centre ",
                "code": "001",
                "bank_id": 38
            },
            {
                "name": "Mombasa ",
                "code": "002",
                "bank_id": 38
            },
            {
                "name": "Kisumu ",
                "code": "003",
                "bank_id": 38
            },
            {
                "name": "Parklands ",
                "code": "005",
                "bank_id": 38
            },
            {
                "name": "Westgate",
                "code": "006",
                "bank_id": 38
            },
            {
                "name": "Mombasa Rd",
                "code": "0088",
                "bank_id": 38
            },
            {
                "name": "Ind Area ",
                "code": "009",
                "bank_id": 38
            },
            {
                "name": "Kisii ",
                "code": "010",
                "bank_id": 38
            },
            {
                "name": "Malindi ",
                "code": "011",
                "bank_id": 38
            },
            {
                "name": "Thika ",
                "code": "012",
                "bank_id": 38
            },
            {
                "name": "Otc ",
                "code": "013",
                "bank_id": 38
            },
            {
                "name": "Eldoret ",
                "code": "014",
                "bank_id": 38
            },
            {
                "name": "Eastleigh ",
                "code": "015",
                "bank_id": 38
            },
            {
                "name": "Changamwe ",
                "code": "016",
                "bank_id": 38
            },
            {
                "name": "T-mall ",
                "code": "017",
                "bank_id": 38
            },
            {
                "name": "Nakuru ",
                "code": "018",
                "bank_id": 38
            },
            {
                "name": "Village Market ",
                "code": "019",
                "bank_id": 38
            },
            {
                "name": "Diani ",
                "code": "020",
                "bank_id": 38
            },
            {
                "name": "Bungoma ",
                "code": "021",
                "bank_id": 38
            },
            {
                "name": "Kitale ",
                "code": "022",
                "bank_id": 38
            },
            {
                "name": "Prestige ",
                "code": "023",
                "bank_id": 38
            },
            {
                "name": "Buru Buru ",
                "code": "024",
                "bank_id": 38
            },
            {
                "name": "Kitengela ",
                "code": "025",
                "bank_id": 38
            },
            {
                "name": "Jomo Kenyatta Branch ",
                "code": "026",
                "bank_id": 38
            },
            {
                "name": "Kakamega ",
                "code": "027",
                "bank_id": 38
            },
            {
                "name": "Kericho ",
                "code": "028",
                "bank_id": 38
            },
            {
                "name": "Upper Hill ",
                "code": "029",
                "bank_id": 38
            },
            {
                "name": "Wabera Street ",
                "code": "030",
                "bank_id": 38
            },
            {
                "name": "Karen ",
                "code": "031",
                "bank_id": 38
            },
            {
                "name": "Voi ",
                "code": "032",
                "bank_id": 38
            },
            {
                "name": "Shimanzi ",
                "code": "033",
                "bank_id": 38
            },
            {
                "name": "Meru ",
                "code": "034",
                "bank_id": 38
            },
            {
                "name": "Diamond Plaza ",
                "code": "035",
                "bank_id": 38
            },
            {
                "name": "crossroad",
                "code": "036",
                "bank_id": 38
            },
            {
                "name": "JKIA",
                "code": "037",
                "bank_id": 38
            },
            {
                "name": "Nyali ",
                "code": "038",
                "bank_id": 38
            },
            {
                "name": "Migori Branch",
                "code": "039",
                "bank_id": 38
            },
            {
                "name": "Madina Mall",
                "code": "040",
                "bank_id": 38
            },
            {
                "name": "Courtyard Branch",
                "code": "041",
                "bank_id": 38
            },
            {
                "name": "Mtwapa Branch",
                "code": "042",
                "bank_id": 38
            },
            {
                "name": "Lamu Branch",
                "code": "043",
                "bank_id": 38
            },
            {
                "name": "Kilifi Branch",
                "code": "044",
                "bank_id": 38
            },
            {
                "name": "Mariakani Branch",
                "code": "045",
                "bank_id": 38
            },
            {
                "name": "Tom Mboya ",
                "code": "050",
                "bank_id": 38
            },
            {
                "name": "9west",
                "code": "055",
                "bank_id": 38
            },
            {
                "name": "Riverside",
                "code": "065",
                "bank_id": 38
            },
            {
                "name": "Mwanzi Road",
                "code": "070",
                "bank_id": 38
            },
            {
                "name": "Lavington",
                "code": "054",
                "bank_id": 38
            },
            {
                "name": "Capital Centre",
                "code": "008",
                "bank_id": 38
            },
            {
                "name": "DTB Center",
                "code": "052",
                "bank_id": 38
            }
        ]
    },
    {
        "id": 39,
        "name": "K-Rep Bank Limited",
        "code": "99",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office ",
                "code": "000",
                "bank_id": 39
            },
            {
                "name": "Main Office ",
                "code": "001",
                "bank_id": 39
            },
            {
                "name": "Mombasa ",
                "code": "002",
                "bank_id": 39
            },
            {
                "name": "Kenyatta Ave Nbi ",
                "code": "003",
                "bank_id": 39
            },
            {
                "name": "Nakuru ",
                "code": "004",
                "bank_id": 39
            },
            {
                "name": "Nyeri ",
                "code": "005",
                "bank_id": 39
            },
            {
                "name": "Buruburu ",
                "code": "006",
                "bank_id": 39
            },
            {
                "name": "Embu ",
                "code": "007",
                "bank_id": 39
            },
            {
                "name": "Eldoret ",
                "code": "008",
                "bank_id": 39
            },
            {
                "name": "Kisumu ",
                "code": "009",
                "bank_id": 39
            },
            {
                "name": "Kericho ",
                "code": "010",
                "bank_id": 39
            },
            {
                "name": "Mlolongo",
                "code": "011",
                "bank_id": 39
            },
            {
                "name": "Thika ",
                "code": "012",
                "bank_id": 39
            },
            {
                "name": "Kerugoya",
                "code": "013",
                "bank_id": 39
            },
            {
                "name": "Kenyatta Market ",
                "code": "014",
                "bank_id": 39
            },
            {
                "name": "Kisii ",
                "code": "015",
                "bank_id": 39
            },
            {
                "name": "CHUKA",
                "code": "016",
                "bank_id": 39
            },
            {
                "name": "Kitui ",
                "code": "017",
                "bank_id": 39
            },
            {
                "name": "Machakos ",
                "code": "018",
                "bank_id": 39
            },
            {
                "name": "Nanyuki ",
                "code": "019",
                "bank_id": 39
            },
            {
                "name": "Kangemi",
                "code": "020",
                "bank_id": 39
            },
            {
                "name": "Email",
                "code": "021",
                "bank_id": 39
            },
            {
                "name": "Naivasha ",
                "code": "022",
                "bank_id": 39
            },
            {
                "name": "Nyahururu ",
                "code": "023",
                "bank_id": 39
            },
            {
                "name": "Isiolo ",
                "code": "024",
                "bank_id": 39
            },
            {
                "name": "Meru ",
                "code": "025",
                "bank_id": 39
            },
            {
                "name": "Kitale ",
                "code": "026",
                "bank_id": 39
            },
            {
                "name": "Kibwezi ",
                "code": "027",
                "bank_id": 39
            },
            {
                "name": "Bungoma ",
                "code": "028",
                "bank_id": 39
            },
            {
                "name": "Kajiado ",
                "code": "029",
                "bank_id": 39
            },
            {
                "name": "Nkubu",
                "code": "030",
                "bank_id": 39
            },
            {
                "name": "Mtwapa ",
                "code": "031",
                "bank_id": 39
            },
            {
                "name": "Busia",
                "code": "032",
                "bank_id": 39
            },
            {
                "name": "Moi Nbi ",
                "code": "033",
                "bank_id": 39
            },
            {
                "name": "Mwea ",
                "code": "034",
                "bank_id": 39
            },
            {
                "name": "Kengeleni ",
                "code": "035",
                "bank_id": 39
            },
            {
                "name": "Kilimani ",
                "code": "036",
                "bank_id": 39
            }
        ]
    },
    {
        "id": 40,
        "name": "Equity Bank Limited",
        "code": "68",
        "paybill": null,
        "branches": [
            {
                "name": "Equity Bank Head Office ",
                "code": "000",
                "bank_id": 40
            },
            {
                "name": "Equity Bank Corporate ",
                "code": "001",
                "bank_id": 40
            },
            {
                "name": "Equity Bank Fourways ",
                "code": "002",
                "bank_id": 40
            },
            {
                "name": "Kangema ",
                "code": "003",
                "bank_id": 40
            },
            {
                "name": "Karatina ",
                "code": "004",
                "bank_id": 40
            },
            {
                "name": "Kiriaini ",
                "code": "005",
                "bank_id": 40
            },
            {
                "name": "Murarandia ",
                "code": "006",
                "bank_id": 40
            },
            {
                "name": "Kangari ",
                "code": "007",
                "bank_id": 40
            },
            {
                "name": "Othaya ",
                "code": "008",
                "bank_id": 40
            },
            {
                "name": "Thika \/ Equity Plaza ",
                "code": "009",
                "bank_id": 40
            },
            {
                "name": "Kerugoya ",
                "code": "010",
                "bank_id": 40
            },
            {
                "name": "Nyeri ",
                "code": "011",
                "bank_id": 40
            },
            {
                "name": "Tom Mboya ",
                "code": "012",
                "bank_id": 40
            },
            {
                "name": "Nakuru ",
                "code": "013",
                "bank_id": 40
            },
            {
                "name": "Meru ",
                "code": "014",
                "bank_id": 40
            },
            {
                "name": "Mama Ngina ",
                "code": "015",
                "bank_id": 40
            },
            {
                "name": "Nyahururu ",
                "code": "016",
                "bank_id": 40
            },
            {
                "name": "Community ",
                "code": "017",
                "bank_id": 40
            },
            {
                "name": "Community Corporate ",
                "code": "018",
                "bank_id": 40
            },
            {
                "name": "Embu ",
                "code": "019",
                "bank_id": 40
            },
            {
                "name": "Naivasha ",
                "code": "020",
                "bank_id": 40
            },
            {
                "name": "Chuka ",
                "code": "021",
                "bank_id": 40
            },
            {
                "name": "Muranga ",
                "code": "022",
                "bank_id": 40
            },
            {
                "name": "Molo ",
                "code": "023",
                "bank_id": 40
            },
            {
                "name": "Harambee Avenu ",
                "code": "024",
                "bank_id": 40
            },
            {
                "name": "Mombasa ",
                "code": "025",
                "bank_id": 40
            },
            {
                "name": "Kimathi Street ",
                "code": "026",
                "bank_id": 40
            },
            {
                "name": "Nanyuki ",
                "code": "027",
                "bank_id": 40
            },
            {
                "name": "Kericho ",
                "code": "028",
                "bank_id": 40
            },
            {
                "name": "Kisumu ",
                "code": "029",
                "bank_id": 40
            },
            {
                "name": "Eldoret ",
                "code": "030",
                "bank_id": 40
            },
            {
                "name": "Nakuru Kenyatta Avenue ",
                "code": "031",
                "bank_id": 40
            },
            {
                "name": "Kariobangi ",
                "code": "032",
                "bank_id": 40
            },
            {
                "name": "Kitale ",
                "code": "033",
                "bank_id": 40
            },
            {
                "name": "Thika Kenyatta Avenue ",
                "code": "034",
                "bank_id": 40
            },
            {
                "name": "Knut House ",
                "code": "035",
                "bank_id": 40
            },
            {
                "name": "Narok ",
                "code": "036",
                "bank_id": 40
            },
            {
                "name": "Nkubu ",
                "code": "037",
                "bank_id": 40
            },
            {
                "name": "Mwea ",
                "code": "038",
                "bank_id": 40
            },
            {
                "name": "Matuu ",
                "code": "039",
                "bank_id": 40
            },
            {
                "name": "Maua ",
                "code": "040",
                "bank_id": 40
            },
            {
                "name": "Isiolo ",
                "code": "041",
                "bank_id": 40
            },
            {
                "name": "Kagio ",
                "code": "042",
                "bank_id": 40
            },
            {
                "name": "Gikomba ",
                "code": "043",
                "bank_id": 40
            },
            {
                "name": "Ukunda ",
                "code": "044",
                "bank_id": 40
            },
            {
                "name": "Malindi ",
                "code": "045",
                "bank_id": 40
            },
            {
                "name": "Mombasa Digo Road ",
                "code": "046",
                "bank_id": 40
            },
            {
                "name": "Moi Avenue ",
                "code": "047",
                "bank_id": 40
            },
            {
                "name": "Bungoma ",
                "code": "048",
                "bank_id": 40
            },
            {
                "name": "Kapsabet ",
                "code": "049",
                "bank_id": 40
            },
            {
                "name": "Kakamega ",
                "code": "050",
                "bank_id": 40
            },
            {
                "name": "Kisii ",
                "code": "051",
                "bank_id": 40
            },
            {
                "name": "Nyamira ",
                "code": "052",
                "bank_id": 40
            },
            {
                "name": "Litein ",
                "code": "053",
                "bank_id": 40
            },
            {
                "name": "Equity Centre Diaspora",
                "code": "054",
                "bank_id": 40
            },
            {
                "name": "Westlands ",
                "code": "055",
                "bank_id": 40
            },
            {
                "name": "Industrial Area Kenpipe Plaza ",
                "code": "056",
                "bank_id": 40
            },
            {
                "name": "Kikuyu ",
                "code": "057",
                "bank_id": 40
            },
            {
                "name": "Garissa ",
                "code": "058",
                "bank_id": 40
            },
            {
                "name": "Mwingi ",
                "code": "059",
                "bank_id": 40
            },
            {
                "name": "Machakos ",
                "code": "060",
                "bank_id": 40
            },
            {
                "name": "Ongata Rongai ",
                "code": "061",
                "bank_id": 40
            },
            {
                "name": "Ol-kalao ",
                "code": "062",
                "bank_id": 40
            },
            {
                "name": "Kawangware ",
                "code": "063",
                "bank_id": 40
            },
            {
                "name": "Kiambu ",
                "code": "064",
                "bank_id": 40
            },
            {
                "name": "Kayole ",
                "code": "065",
                "bank_id": 40
            },
            {
                "name": "Gatundu ",
                "code": "066",
                "bank_id": 40
            },
            {
                "name": "Wote ",
                "code": "067",
                "bank_id": 40
            },
            {
                "name": "Mumias ",
                "code": "068",
                "bank_id": 40
            },
            {
                "name": "Limuru ",
                "code": "069",
                "bank_id": 40
            },
            {
                "name": "Kitengela ",
                "code": "070",
                "bank_id": 40
            },
            {
                "name": "Githurai ",
                "code": "071",
                "bank_id": 40
            },
            {
                "name": "Kitui ",
                "code": "072",
                "bank_id": 40
            },
            {
                "name": "Ngong ",
                "code": "073",
                "bank_id": 40
            },
            {
                "name": "Loitoktok ",
                "code": "074",
                "bank_id": 40
            },
            {
                "name": "Bondo ",
                "code": "075",
                "bank_id": 40
            },
            {
                "name": "Mbita ",
                "code": "076",
                "bank_id": 40
            },
            {
                "name": "Gilgil ",
                "code": "077",
                "bank_id": 40
            },
            {
                "name": "Busia ",
                "code": "078",
                "bank_id": 40
            },
            {
                "name": "Voi ",
                "code": "079",
                "bank_id": 40
            },
            {
                "name": "Enterprise Road ",
                "code": "080",
                "bank_id": 40
            },
            {
                "name": "Equity Centre ",
                "code": "081",
                "bank_id": 40
            },
            {
                "name": "Donholm ",
                "code": "082",
                "bank_id": 40
            },
            {
                "name": "Mukurwe-ini ",
                "code": "083",
                "bank_id": 40
            },
            {
                "name": "Eastleigh ",
                "code": "084",
                "bank_id": 40
            },
            {
                "name": "Namanga ",
                "code": "085",
                "bank_id": 40
            },
            {
                "name": "Kajiado ",
                "code": "086",
                "bank_id": 40
            },
            {
                "name": "Ruiru ",
                "code": "087",
                "bank_id": 40
            },
            {
                "name": "Otc ",
                "code": "088",
                "bank_id": 40
            },
            {
                "name": "Kenol ",
                "code": "089",
                "bank_id": 40
            },
            {
                "name": "Tala ",
                "code": "090",
                "bank_id": 40
            },
            {
                "name": "Ngara ",
                "code": "091",
                "bank_id": 40
            },
            {
                "name": "Nandi Hills ",
                "code": "092",
                "bank_id": 40
            },
            {
                "name": "Githunguri ",
                "code": "093",
                "bank_id": 40
            },
            {
                "name": "Tea Room ",
                "code": "094",
                "bank_id": 40
            },
            {
                "name": "Buru Buru ",
                "code": "095",
                "bank_id": 40
            },
            {
                "name": "Mbale ",
                "code": "096",
                "bank_id": 40
            },
            {
                "name": "Siaya ",
                "code": "097",
                "bank_id": 40
            },
            {
                "name": "Homa Bay ",
                "code": "098",
                "bank_id": 40
            },
            {
                "name": "Lodwar ",
                "code": "099",
                "bank_id": 40
            },
            {
                "name": "Mandera ",
                "code": "100",
                "bank_id": 40
            },
            {
                "name": "Marsabit ",
                "code": "101",
                "bank_id": 40
            },
            {
                "name": "Moyale ",
                "code": "102",
                "bank_id": 40
            },
            {
                "name": "Wajir ",
                "code": "103",
                "bank_id": 40
            },
            {
                "name": "Meru Makutano ",
                "code": "104",
                "bank_id": 40
            },
            {
                "name": "Malaba Town ",
                "code": "105",
                "bank_id": 40
            },
            {
                "name": "Kilifi ",
                "code": "106",
                "bank_id": 40
            },
            {
                "name": "Kapenguria ",
                "code": "107",
                "bank_id": 40
            },
            {
                "name": "Mombasa Road ",
                "code": "108",
                "bank_id": 40
            },
            {
                "name": "Eldoret Market ",
                "code": "109",
                "bank_id": 40
            },
            {
                "name": "Maralal ",
                "code": "110",
                "bank_id": 40
            },
            {
                "name": "Kimende ",
                "code": "111",
                "bank_id": 40
            },
            {
                "name": "Luanda ",
                "code": "112",
                "bank_id": 40
            },
            {
                "name": "Ku Sub Branch ",
                "code": "113",
                "bank_id": 40
            },
            {
                "name": "Kengeleni ",
                "code": "114",
                "bank_id": 40
            },
            {
                "name": "Nyeri Kimathi Way ",
                "code": "115",
                "bank_id": 40
            },
            {
                "name": "Migori ",
                "code": "116",
                "bank_id": 40
            },
            {
                "name": "Kibera ",
                "code": "117",
                "bank_id": 40
            },
            {
                "name": "Kasarani ",
                "code": "118",
                "bank_id": 40
            },
            {
                "name": "Mtwapa ",
                "code": "119",
                "bank_id": 40
            },
            {
                "name": "Changamwe ",
                "code": "120",
                "bank_id": 40
            },
            {
                "name": "Hola ",
                "code": "121",
                "bank_id": 40
            },
            {
                "name": "Bomet ",
                "code": "122",
                "bank_id": 40
            },
            {
                "name": "Kilgoris ",
                "code": "123",
                "bank_id": 40
            },
            {
                "name": "Keroka ",
                "code": "124",
                "bank_id": 40
            },
            {
                "name": "KAREN",
                "code": "125",
                "bank_id": 40
            },
            {
                "name": "KISUMU ANGAWA AVE",
                "code": "126",
                "bank_id": 40
            },
            {
                "name": "MPEKETONI",
                "code": "127",
                "bank_id": 40
            },
            {
                "name": "NAIROBI WEST",
                "code": "128",
                "bank_id": 40
            },
            {
                "name": "KENYATTA AVENUE",
                "code": "129",
                "bank_id": 40
            },
            {
                "name": "City Hall",
                "code": "130",
                "bank_id": 40
            },
            {
                "name": "Eldama Ravine",
                "code": "131",
                "bank_id": 40
            },
            {
                "name": "Embakasi",
                "code": "132",
                "bank_id": 40
            },
            {
                "name": "KPCU",
                "code": "133",
                "bank_id": 40
            },
            {
                "name": "Ridgeways",
                "code": "134",
                "bank_id": 40
            },
            {
                "name": "Runyenjes Sub Branch",
                "code": "135",
                "bank_id": 40
            },
            {
                "name": "Dadaad",
                "code": "136",
                "bank_id": 40
            },
            {
                "name": "Kangemi",
                "code": "137",
                "bank_id": 40
            },
            {
                "name": "Nyali Centre Corporate",
                "code": "138",
                "bank_id": 40
            },
            {
                "name": "Kabarnet",
                "code": "139",
                "bank_id": 40
            },
            {
                "name": "Westlands Corporate",
                "code": "140",
                "bank_id": 40
            },
            {
                "name": "Lavington Corporate",
                "code": "141",
                "bank_id": 40
            },
            {
                "name": "Taita Taveta",
                "code": "142",
                "bank_id": 40
            },
            {
                "name": "Awendo",
                "code": "143",
                "bank_id": 40
            },
            {
                "name": "Ruai",
                "code": "144",
                "bank_id": 40
            },
            {
                "name": "Kilimani",
                "code": "145",
                "bank_id": 40
            },
            {
                "name": "Nakuru Corporate",
                "code": "146",
                "bank_id": 40
            },
            {
                "name": "Kilimani Supreme",
                "code": "147",
                "bank_id": 40
            },
            {
                "name": "JKIA Cargo Centre",
                "code": "148",
                "bank_id": 40
            },
            {
                "name": "EPZ Athi River",
                "code": "149",
                "bank_id": 40
            },
            {
                "name": "Oyugis",
                "code": "150",
                "bank_id": 40
            },
            {
                "name": "Mayfair Supreme Centre",
                "code": "151",
                "bank_id": 40
            },
            {
                "name": "Juja",
                "code": "152",
                "bank_id": 40
            },
            {
                "name": "Iten",
                "code": "153",
                "bank_id": 40
            },
            {
                "name": "Ewaso Nyiro",
                "code": "154",
                "bank_id": 40
            },
            {
                "name": "Thika Supreme Centre",
                "code": "155",
                "bank_id": 40
            },
            {
                "name": "Mombasa Supreme Centre",
                "code": "156",
                "bank_id": 40
            },
            {
                "name": "Dagoretti",
                "code": "169",
                "bank_id": 40
            }
        ]
    },
    {
        "id": 41,
        "name": "Family Bank Ltd",
        "code": "70",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office ",
                "code": "000",
                "bank_id": 41
            },
            {
                "name": "Kiambu ",
                "code": "001",
                "bank_id": 41
            },
            {
                "name": "Githunguri ",
                "code": "002",
                "bank_id": 41
            },
            {
                "name": "Sonalux ",
                "code": "003",
                "bank_id": 41
            },
            {
                "name": "Gatundu ",
                "code": "004",
                "bank_id": 41
            },
            {
                "name": "Thika ",
                "code": "005",
                "bank_id": 41
            },
            {
                "name": "Muranga ",
                "code": "006",
                "bank_id": 41
            },
            {
                "name": "Kangari ",
                "code": "007",
                "bank_id": 41
            },
            {
                "name": "Kiria-ini ",
                "code": "008",
                "bank_id": 41
            },
            {
                "name": "Kangema ",
                "code": "009",
                "bank_id": 41
            },
            {
                "name": "Othaya ",
                "code": "011",
                "bank_id": 41
            },
            {
                "name": "Kenyatta Avenue ",
                "code": "012",
                "bank_id": 41
            },
            {
                "name": "Cargen House ",
                "code": "014",
                "bank_id": 41
            },
            {
                "name": "Nakuru Finance House ",
                "code": "018",
                "bank_id": 41
            },
            {
                "name": "Nakuru Market",
                "code": "019",
                "bank_id": 41
            },
            {
                "name": "Dagoretti",
                "code": "021",
                "bank_id": 41
            },
            {
                "name": "Kericho",
                "code": "022",
                "bank_id": 41
            },
            {
                "name": "Nyahururu",
                "code": "023",
                "bank_id": 41
            },
            {
                "name": "Ruiru ",
                "code": "024",
                "bank_id": 41
            },
            {
                "name": "Kisumu Reliance",
                "code": "025",
                "bank_id": 41
            },
            {
                "name": "Nyamira ",
                "code": "026",
                "bank_id": 41
            },
            {
                "name": "Kisii ",
                "code": "027",
                "bank_id": 41
            },
            {
                "name": "Kisumu Al Imran",
                "code": "028",
                "bank_id": 41
            },
            {
                "name": "Narok",
                "code": "029",
                "bank_id": 41
            },
            {
                "name": "Industrial Area ",
                "code": "031",
                "bank_id": 41
            },
            {
                "name": "Donholm ",
                "code": "033",
                "bank_id": 41
            },
            {
                "name": "Fourways Retail Branch",
                "code": "035",
                "bank_id": 41
            },
            {
                "name": "Ktda Plaza ",
                "code": "038",
                "bank_id": 41
            },
            {
                "name": "Kariobangi ",
                "code": "041",
                "bank_id": 41
            },
            {
                "name": "Gikomba Area 42",
                "code": "042",
                "bank_id": 41
            },
            {
                "name": "Sokoni ",
                "code": "043",
                "bank_id": 41
            },
            {
                "name": "Githurai ",
                "code": "045",
                "bank_id": 41
            },
            {
                "name": "Yaya ",
                "code": "046",
                "bank_id": 41
            },
            {
                "name": "Limuru ",
                "code": "047",
                "bank_id": 41
            },
            {
                "name": "Westlands",
                "code": "048",
                "bank_id": 41
            },
            {
                "name": "Kagwe",
                "code": "049",
                "bank_id": 41
            },
            {
                "name": "Banana ",
                "code": "051",
                "bank_id": 41
            },
            {
                "name": "Naivasha ",
                "code": "053",
                "bank_id": 41
            },
            {
                "name": "Nyeri ",
                "code": "055",
                "bank_id": 41
            },
            {
                "name": "Karatina",
                "code": "056",
                "bank_id": 41
            },
            {
                "name": "Kerugoya ",
                "code": "057",
                "bank_id": 41
            },
            {
                "name": "Tom Mboya ",
                "code": "058",
                "bank_id": 41
            },
            {
                "name": "River Road ",
                "code": "059",
                "bank_id": 41
            },
            {
                "name": "Kayole ",
                "code": "061",
                "bank_id": 41
            },
            {
                "name": "Nkubu ",
                "code": "062",
                "bank_id": 41
            },
            {
                "name": "Meru ",
                "code": "063",
                "bank_id": 41
            },
            {
                "name": "Nanyuki",
                "code": "064",
                "bank_id": 41
            },
            {
                "name": "Ktda Plaza Corporate ",
                "code": "065",
                "bank_id": 41
            },
            {
                "name": "Ongata Rongai ",
                "code": "066",
                "bank_id": 41
            },
            {
                "name": "Fourways Corporate Branch ",
                "code": "068",
                "bank_id": 41
            },
            {
                "name": "Ngara",
                "code": "069",
                "bank_id": 41
            },
            {
                "name": "Kitengela ",
                "code": "071",
                "bank_id": 41
            },
            {
                "name": "Kitui",
                "code": "072",
                "bank_id": 41
            },
            {
                "name": "Mackakos ",
                "code": "073",
                "bank_id": 41
            },
            {
                "name": "Embu ",
                "code": "075",
                "bank_id": 41
            },
            {
                "name": "Bungoma ",
                "code": "077",
                "bank_id": 41
            },
            {
                "name": "Kakamega ",
                "code": "078",
                "bank_id": 41
            },
            {
                "name": "Busia ",
                "code": "079",
                "bank_id": 41
            },
            {
                "name": "Mumias",
                "code": "081",
                "bank_id": 41
            },
            {
                "name": "Eldoret West",
                "code": "082",
                "bank_id": 41
            },
            {
                "name": "Molo ",
                "code": "083",
                "bank_id": 41
            },
            {
                "name": "Eldoret ",
                "code": "085",
                "bank_id": 41
            },
            {
                "name": "Digo",
                "code": "092",
                "bank_id": 41
            },
            {
                "name": "Kitale ",
                "code": "093",
                "bank_id": 41
            },
            {
                "name": "Mtwapa",
                "code": "094",
                "bank_id": 41
            },
            {
                "name": "Mombasa Nkrumah Road",
                "code": "095",
                "bank_id": 41
            },
            {
                "name": "Mombasa Jomo Kenyatta Avenue",
                "code": "096",
                "bank_id": 41
            },
            {
                "name": "Kapsabet ",
                "code": "097",
                "bank_id": 41
            },
            {
                "name": "Kikuyu",
                "code": "102",
                "bank_id": 41
            },
            {
                "name": "Thika Makongeni",
                "code": "032",
                "bank_id": 41
            },
            {
                "name": "Kahawa West",
                "code": "044",
                "bank_id": 41
            }
        ]
    },
    {
        "id": 42,
        "name": "Gulf African Bank Ltd",
        "code": "72",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office ",
                "code": "000",
                "bank_id": 42
            },
            {
                "name": "Central Clearing Centre ",
                "code": "001",
                "bank_id": 42
            },
            {
                "name": "Upperhill ",
                "code": "002",
                "bank_id": 42
            },
            {
                "name": "Eastleigh ",
                "code": "003",
                "bank_id": 42
            },
            {
                "name": "Kenyatta Avenue ",
                "code": "004",
                "bank_id": 42
            },
            {
                "name": "Mombasa ",
                "code": "005",
                "bank_id": 42
            },
            {
                "name": "Garissa ",
                "code": "006",
                "bank_id": 42
            },
            {
                "name": "Lamu ",
                "code": "007",
                "bank_id": 42
            },
            {
                "name": "Malindi ",
                "code": "008",
                "bank_id": 42
            },
            {
                "name": "Muthaiga ",
                "code": "009",
                "bank_id": 42
            },
            {
                "name": "Bondeni ",
                "code": "010",
                "bank_id": 42
            },
            {
                "name": "Eastleigh 7th Street",
                "code": "011",
                "bank_id": 42
            },
            {
                "name": "Eastleigh Athumani Kipanga Street",
                "code": "012",
                "bank_id": 42
            },
            {
                "name": "Westlands",
                "code": "013",
                "bank_id": 42
            },
            {
                "name": "Industrial Area",
                "code": "014",
                "bank_id": 42
            },
            {
                "name": "Jomo Kenyatta Avenue",
                "code": "015",
                "bank_id": 42
            },
            {
                "name": "Bombululu",
                "code": "016",
                "bank_id": 42
            }
        ]
    },
    {
        "id": 43,
        "name": "First Community Bank",
        "code": "74",
        "paybill": null,
        "branches": [
            {
                "name": "Wabera Street ",
                "code": "001",
                "bank_id": 43
            },
            {
                "name": "Eastleigh 1 ",
                "code": "002",
                "bank_id": 43
            },
            {
                "name": "Mombasa 1 ",
                "code": "003",
                "bank_id": 43
            },
            {
                "name": "Garissa ",
                "code": "004",
                "bank_id": 43
            },
            {
                "name": "Eastleigh 2 - General Waruing ",
                "code": "005",
                "bank_id": 43
            },
            {
                "name": "Malindi ",
                "code": "006",
                "bank_id": 43
            },
            {
                "name": "Kisumu ",
                "code": "007",
                "bank_id": 43
            },
            {
                "name": "Kimathi Street ",
                "code": "008",
                "bank_id": 43
            },
            {
                "name": "Westlands ",
                "code": "009",
                "bank_id": 43
            },
            {
                "name": "South C ",
                "code": "010",
                "bank_id": 43
            },
            {
                "name": "Industrial Area ",
                "code": "011",
                "bank_id": 43
            },
            {
                "name": "Masalani ",
                "code": "012",
                "bank_id": 43
            },
            {
                "name": "Habasweni ",
                "code": "013",
                "bank_id": 43
            },
            {
                "name": "Wajir ",
                "code": "014",
                "bank_id": 43
            },
            {
                "name": "Moyale ",
                "code": "015",
                "bank_id": 43
            },
            {
                "name": "Nakuru ",
                "code": "016",
                "bank_id": 43
            },
            {
                "name": "Mombasa 2 ",
                "code": "017",
                "bank_id": 43
            },
            {
                "name": "Head Office\/clearing Center ",
                "code": "999",
                "bank_id": 43
            }
        ]
    },
    {
        "id": 44,
        "name": "UBA Kenya Bank Ltd",
        "code": "76",
        "paybill": null,
        "branches": [
            {
                "name": "Westlands ",
                "code": "001",
                "bank_id": 44
            },
            {
                "name": "Enterprise Road ",
                "code": "002",
                "bank_id": 44
            },
            {
                "name": "Upper Hill ",
                "code": "003",
                "bank_id": 44
            },
            {
                "name": "Head Office ",
                "code": "099",
                "bank_id": 44
            }
        ]
    },
    {
        "id": 45,
        "name": "Caritas Microfinance Bank",
        "code": "00",
        "paybill": "899790",
        "branches": [
            {
                "name": "Cardinal Otunga Plaza",
                "code": "1600",
                "bank_id": 45
            }
        ]
    },
    {
        "id": 46,
        "name": "SBM",
        "code": "60",
        "paybill": "552800",
        "branches": [
            {
                "name": "City Centre Branch",
                "code": "001",
                "bank_id": 46
            },
            {
                "name": "Lavington",
                "code": "046",
                "bank_id": 46
            },
            {
                "name": "Donholm",
                "code": "012",
                "bank_id": 46
            },
            {
                "name": "Connerhouse",
                "code": "014",
                "bank_id": 46
            },
            {
                "name": "Machakos",
                "code": "034",
                "bank_id": 46
            }
        ]
    },
    {
        "id": 47,
        "name": "Sidian Bank",
        "code": "66",
        "paybill": "111999",
        "branches": [
            {
                "name": "Kenyatta Avenue",
                "code": "003",
                "bank_id": 47
            },
            {
                "name": "Nakuru",
                "code": "004",
                "bank_id": 47
            },
            {
                "name": "Buruburu",
                "code": "006",
                "bank_id": 47
            },
            {
                "name": "River Road",
                "code": "052",
                "bank_id": 47
            },
            {
                "name": "Kilimani",
                "code": "036",
                "bank_id": 47
            },
            {
                "name": "Moi Avenue",
                "code": "033",
                "bank_id": 47
            }
        ]
    },
    {
        "id": 48,
        "name": "Faulu Microfinance Bank",
        "code": "79",
        "paybill": null,
        "branches": [
            {
                "name": "Ngong Rd",
                "code": "006",
                "bank_id": 48
            }
        ]
    },
    {
        "id": 49,
        "name": "KWFT Microfinance Bank",
        "code": "78",
        "paybill": null,
        "branches": [
            {
                "name": "Head Office",
                "code": "000",
                "bank_id": 49
            }
        ]
    },
    {
        "id": 50,
        "name": "SMEP Microfinance  Bank",
        "code": "89",
        "paybill": null,
        "branches": [
            {
                "name": "Tumaini House",
                "code": "000",
                "bank_id": 50
            }
        ]
    }
]


  `
);

export const banksData = sortArrayByKey('name', 'ASC', banks);
