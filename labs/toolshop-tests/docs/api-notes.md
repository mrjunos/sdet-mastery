# Documentación de Endpoints — Toolshop API

## 1. GET Product by ID
| Atributo | Detalle |
| :--- | :--- |
| **Método HTTP** | `GET` |
| **Path (Ruta)** | `/products/{productId}` |
| **¿Requiere Auth?** | No |
| **Parámetros** | **productId:** `01KVB1J04JMMZ3N5CGFP9HTXCK` |
| **Status Codes** | `200 OK` <br> `404 Not Found` |

### Estructura del Response (JSON)
```json
{
  "id": "01KVB1J04JMMZ3N5CGFP9HTXCK",
  "name": "Combination Pliers",
  "description": "Versatile combination pliers designed for gripping, bending, and cutting wire with ease. Featuring chrome vanadium steel construction with induction-hardened cutting edges, these pliers deliver excellent grip and leverage for a wide range of tasks. The precision-machined jaws combine flat gripping surfaces with a pipe-grip section and integrated wire cutter for true multi-purpose functionality. Ergonomic bi-component handles reduce hand fatigue during extended use and provide a secure hold even with oily or gloved hands. The joint is precisely fitted to eliminate play and ensure smooth operation over thousands of cycles. Ideal for electricians, mechanics, and DIY enthusiasts tackling everyday projects around the workshop or job site.",
  "price": 14.15,
  "is_location_offer": false,
  "is_rental": false,
  "co2_rating": "D",
  "in_stock": true,
  "is_eco_friendly": false,
  "product_image": {
    "id": "01KVB1J03YW92DBA8YNGJ53JGS",
    "by_name": "Helinton Fantin",
    "by_url": "https://unsplash.com/@fantin",
    "source_name": "Unsplash",
    "source_url": "https://unsplash.com/photos/W8BNwvOvW4M",
    "file_name": "pliers01.avif",
    "title": "Combination pliers"
  },
  "category": {
    "id": "01KVB1J03JJRVEYBQBDXRZP39D",
    "name": "Pliers",
    "slug": "pliers",
    "parent_id": "01KVB1J037ASKYR3DSFDRMK93E"
  },
  "brand": {
    "id": "01KVB1HZRX2FHZS7P4SR586W6Y",
    "name": "ForgeFlex Tools"
  },
  "specs": [
    {
      "id": "01KVB1J0HAQ70XQYQ7YCGS256B",
      "product_id": "01KVB1J04JMMZ3N5CGFP9HTXCK",
      "spec_name": "Handle Material",
      "spec_value": "Bi-component",
      "spec_unit": null
    },
    {
      "id": "01KVB1J0HAQ70XQYQ7YCGS2569",
      "product_id": "01KVB1J04JMMZ3N5CGFP9HTXCK",
      "spec_name": "Length",
      "spec_value": "200",
      "spec_unit": "mm"
    },
    {
      "id": "01KVB1J0HAQ70XQYQ7YCGS256A",
      "product_id": "01KVB1J04JMMZ3N5CGFP9HTXCK",
      "spec_name": "Material",
      "spec_value": "Chrome Vanadium Steel",
      "spec_unit": null
    },
    {
      "id": "01KVB1J0HAQ70XQYQ7YCGS256C",
      "product_id": "01KVB1J04JMMZ3N5CGFP9HTXCK",
      "spec_name": "Warranty",
      "spec_value": "2",
      "spec_unit": "years"
    },
    {
      "id": "01KVB1J0HAQ70XQYQ7YCGS2568",
      "product_id": "01KVB1J04JMMZ3N5CGFP9HTXCK",
      "spec_name": "Weight",
      "spec_value": "340",
      "spec_unit": "g"
    }
  ]
}
```

## 2. POST Add item to cart
| Atributo | Detalle |
| :--- | :--- |
| **Método HTTP** | `POST` |
| **Path (Ruta)** | `/carts/{id}` |
| **¿Requiere Auth?** | No |
| **Parámetros** | **id:** `01kvb3gktzt98e1mb9sfapp4xa` |
| **Status Codes** | `200 OK` (Item added) <br> `404 Not Found` (Requested item not found) <br> `405 Method Not Allowed` (Method is not allowed for the requested route) <br> `422 Unprocessable Content` (Method is not allowed for the requested route) <br> |

### Estructura del Rquest (JSON)
```json
{
  "product_id": "01KTWBCC1C9E7X7SGZVP65MRQX",
  "quantity": 1
}
```

### Estructura del Response (JSON)
```json
{
  "result": "item added or updated"
}
```

## 3. GET Retrieve specific category
| Atributo | Detalle |
| :--- | :--- |
| **Método HTTP** | `GET` |
| **Path (Ruta)** | `/categories/tree/{categoryId}` |
| **¿Requiere Auth?** | No |
| **Parámetros** | **categoryId:** `01KVEJVMYS6J1MV96S61HRMWB9` |
| **Status Codes** | `200 OK` (Successful operation) <br> `404 Not Found` (Requested item not found) <br> `405 Method Not Allowed` (Method is not allowed for the requested route) |

### Estructura del Response (JSON)
```json
{
  "id": "01KVEJVMYS6J1MV96S61HRMWB9",
  "name": "Hand Tools",
  "slug": "hand-tools",
  "parent_id": null,
  "sub_categories": [
    {
      "id": "01KVEJVMZFMGFYB1APERE0FCGW",
      "name": "Hammer",
      "slug": "hammer",
      "parent_id": "01KVEJVMYS6J1MV96S61HRMWB9",
      "sub_categories": []
    },
    {
      "id": "01KVEJVMZFMGFYB1APERE0FCGX",
      "name": "Hand Saw",
      "slug": "hand-saw",
      "parent_id": "01KVEJVMYS6J1MV96S61HRMWB9",
      "sub_categories": []
    },
    {
      "id": "01KVEJVMZFMGFYB1APERE0FCGY",
      "name": "Wrench",
      "slug": "wrench",
      "parent_id": "01KVEJVMYS6J1MV96S61HRMWB9",
      "sub_categories": []
    },
    {
      "id": "01KVEJVMZFMGFYB1APERE0FCGZ",
      "name": "Screwdriver",
      "slug": "screwdriver",
      "parent_id": "01KVEJVMYS6J1MV96S61HRMWB9",
      "sub_categories": []
    },
    {
      "id": "01KVEJVMZFMGFYB1APERE0FCH0",
      "name": "Pliers",
      "slug": "pliers",
      "parent_id": "01KVEJVMYS6J1MV96S61HRMWB9",
      "sub_categories": []
    },
    {
      "id": "01KVEJVMZFMGFYB1APERE0FCH1",
      "name": "Chisels",
      "slug": "chisels",
      "parent_id": "01KVEJVMYS6J1MV96S61HRMWB9",
      "sub_categories": []
    },
    {
      "id": "01KVEJVMZFMGFYB1APERE0FCH2",
      "name": "Measures",
      "slug": "measures",
      "parent_id": "01KVEJVMYS6J1MV96S61HRMWB9",
      "sub_categories": []
    }
  ]
}
```

## 4. POST Store new user
| Atributo | Detalle |
| :--- | :--- |
| **Método HTTP** | `POST` |
| **Path (Ruta)** | `/users/register` |
| **¿Requiere Auth?** | No |
| **Parámetros** | **None** |
| **Status Codes** | `201` (Successful operation) <br> `400` (Bad Request) <br> `401` (Returns when user is not authenticated) <br> `403` (Forbidden) <br> `409` (The resource conflicts with an existing one) |

### Estructura del Rquest (JSON)
```json
{
  "first_name": "Juan",
  "last_name": "Cano",
  "address": {
    "street": "Street 1",
    "city": "City",
    "state": "State",
    "country": "Country",
    "postal_code": "1234AA"
  },
  "phone": "0987654321",
  "dob": "1970-01-01",
  "password": "SuperDuperSecure@123",
  "email": "juan@cano.example"
}
```

### Estructura del Response (JSON)
```json
{
  "first_name": "Juan",
  "last_name": "Cano",
  "phone": "0987654321",
  "dob": "1970-01-01",
  "email": "juan@cano.example",
  "id": "01kvemaa1qd28t09vev09cx9bc",
  "created_at": "2026-06-19 00:25:57",
  "address": {
    "street": "Street 1",
    "house_number": null,
    "city": "City",
    "state": "State",
    "country": "Country",
    "postal_code": "1234AA"
  }
}
```

## 5. POST Login customer
| Atributo | Detalle |
| :--- | :--- |
| **Método HTTP** | `POST` |
| **Path (Ruta)** | `/users/login` |
| **¿Requiere Auth?** | No |
| **Parámetros** | **None** |
| **Status Codes** | `200` (A token) |

### Estructura del Rquest (JSON)
```json
{
  "email": "juan@cano.example",
  "password": "SuperDuperSecure@123"
}
```

### Estructura del Response (JSON)
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaS5wcmFjdGljZXNvZnR3YXJldGVzdGluZy5jb20vdXNlcnMvbG9naW4iLCJpYXQiOjE3ODE4MzE0MjIsImV4cCI6MTc4MTgzMTcyMiwibmJmIjoxNzgxODMxNDIyLCJqdGkiOiJXUjRjeVpOVFc3S21BdUxmIiwic3ViIjoiMDFLVkVQOTdYRTZXWUhYTVNXOVlOVzlFUDAiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3Iiwicm9sZSI6InVzZXIifQ.lCUcy5dQ0kiNQf81d1iEHnk7Js_sVg30LWyNvubwYeY",
  "token_type": "bearer",
  "expires_in": 300
}
```

## 6. GET Retrieve current customer Info
| Atributo | Detalle |
| :--- | :--- |
| **Método HTTP** | `POST` |
| **Path (Ruta)** | `/users/me` |
| **¿Requiere Auth?** | Yes |
| **Parámetros** | **None** |
| **Status Codes** | `200` (A customer) <br> `401` (Returns when user is not authenticated) |
| **Headers** | `authorization` Bearer Token |

### Estructura del Response (JSON)
```json
{
  "id": "01KVEP97XE6WYHXMSW9YNW9EP0",
  "provider": null,
  "first_name": "Jane",
  "last_name": "Doe",
  "phone": null,
  "dob": "1980-02-02",
  "email": "customer@practicesoftwaretesting.com",
  "totp_enabled": false,
  "created_at": "2026-06-19 01:00:19",
  "address": {
    "street": "Test street 98",
    "house_number": null,
    "city": "Vienna",
    "state": null,
    "country": "Austria",
    "postal_code": null
  }
}
```

## 6. Cart flow 
### Create cart, Add 2 products, review total.

Create cart: 
```shell
curl -X 'POST' \
  'https://api.practicesoftwaretesting.com/carts' \
  -H 'accept: application/json' \
  -d ''
```

Response:
```json
{
  "id": "01kveqt6qmqvp0wfyhawhy2jm2"
}
```

Get cart: 
```shell
curl -X 'GET' \
  'https://api.practicesoftwaretesting.com/carts/01kveqt6qmqvp0wfyhawhy2jm2' \
  -H 'accept: application/json'
```

Response:
```json
{
  "id": "01kveqt6qmqvp0wfyhawhy2jm2",
  "additional_discount_percentage": null,
  "lat": null,
  "lng": null,
  "cart_items": []
}
```

Get Products: 
```shell
curl -X 'GET' \
  'https://api.practicesoftwaretesting.com/products' \
  -H 'accept: application/json'
```

Response:
```json
{
  "current_page": 1,
  "data": [
    {
      "id": "01KVEP987FB1E13RG513RF7H5Q",
      "name": "Combination Pliers",
      "description": "Versatile combination pliers designed for gripping, bending, and cutting wire with ease. Featuring chrome vanadium steel construction with induction-hardened cutting edges, these pliers deliver excellent grip and leverage for a wide range of tasks. The precision-machined jaws combine flat gripping surfaces with a pipe-grip section and integrated wire cutter for true multi-purpose functionality. Ergonomic bi-component handles reduce hand fatigue during extended use and provide a secure hold even with oily or gloved hands. The joint is precisely fitted to eliminate play and ensure smooth operation over thousands of cycles. Ideal for electricians, mechanics, and DIY enthusiasts tackling everyday projects around the workshop or job site.",
      "price": 14.15,
      "is_location_offer": false,
      "is_rental": false,
      "co2_rating": "D",
      "in_stock": true,
      "is_eco_friendly": false,
      "product_image": {
        "id": "01KVEP986M26MNZ7QSG621QAAH",
        "by_name": "Helinton Fantin",
        "by_url": "https://unsplash.com/@fantin",
        "source_name": "Unsplash",
        "source_url": "https://unsplash.com/photos/W8BNwvOvW4M",
        "file_name": "pliers01.avif",
        "title": "Combination pliers"
      },
      "category": {
        "id": "01KVEP9863WWC7EBS954M702AD",
        "name": "Pliers",
        "slug": "pliers"
      },
      "brand": {
        "id": "01KVEP97TT8Q9YGVPA8ND72MTS",
        "name": "ForgeFlex Tools"
      }
    },
    {
      "id": "01KVEP987KYDBBW56W18FZQ8C2",
      "name": "Pliers",
      "description": "Reliable general-purpose pliers crafted from drop-forged carbon steel for long-lasting durability in demanding working conditions. The serrated jaws provide a firm grip on a variety of materials including wire, nails, small fasteners, and irregularly shaped objects. Comfortable rubber-coated handles absorb vibration and reduce hand fatigue during extended use, while the non-slip surface ensures confident handling. The precision pivot joint maintains alignment under load, delivering smooth, controlled jaw action with every squeeze. Heat-treated steel construction resists wear and deformation even under heavy use. A must-have foundational tool for any workshop, equally suited for professional tradespeople and home repair projects.",
      "price": 12.01,
      "is_location_offer": false,
      "is_rental": false,
      "co2_rating": "D",
      "in_stock": true,
      "is_eco_friendly": false,
      "product_image": {
        "id": "01KVEP986M26MNZ7QSG621QAAJ",
        "by_name": "Everyday basics",
        "by_url": "https://unsplash.com/@zanardi",
        "source_name": "Unsplash",
        "source_url": "https://unsplash.com/photos/I8eTuMmxIfo",
        "file_name": "pliers02.avif",
        "title": "Pliers"
      },
      "category": {
        "id": "01KVEP9863WWC7EBS954M702AD",
        "name": "Pliers",
        "slug": "pliers"
      },
      "brand": {
        "id": "01KVEP97TT8Q9YGVPA8ND72MTS",
        "name": "ForgeFlex Tools"
      }
    },
    {
      "id": "01KVEP987QKYEJ9M8BCPT8GN04",
      "name": "Bolt Cutters",
      "description": "Heavy-duty bolt cutters engineered to slice through hardened bolts, chains, padlocks, and wire fencing with minimal effort. The compound leverage mechanism multiplies your cutting force by a factor of 30, enabling clean cuts through materials up to 10mm in diameter. Hardened alloy steel blades are precisely ground and heat-treated to maintain a sharp edge through years of repeated use on tough materials. Ergonomic rubber grips and the generous 750mm handle length provide excellent control, leverage, and reach during overhead or awkward-angle cuts. An adjustable blade tension screw lets you fine-tune the jaw alignment for optimal cutting performance. Built for demolition crews, locksmiths, fencing contractors, and maintenance professionals who need reliable cutting power day after day.",
      "price": 48.41,
      "is_location_offer": true,
      "is_rental": false,
      "co2_rating": "D",
      "in_stock": true,
      "is_eco_friendly": false,
      "product_image": {
        "id": "01KVEP986M26MNZ7QSG621QAAK",
        "by_name": "Michael Dziedzic",
        "by_url": "https://unsplash.com/@lazycreekimages",
        "source_name": "Unsplash",
        "source_url": "https://unsplash.com/photos/pM9pkc9J918",
        "file_name": "pliers03.avif",
        "title": "Bolt cutters"
      },
      "category": {
        "id": "01KVEP9863WWC7EBS954M702AD",
        "name": "Pliers",
        "slug": "pliers"
      },
      "brand": {
        "id": "01KVEP97TT8Q9YGVPA8ND72MTT",
        "name": "MightyCraft Hardware"
      }
    },
    {
      "id": "01KVEP987WN62GWWKX0RWE32WR",
      "name": "Long Nose Pliers",
      "description": "Precision long nose pliers with narrow tapered jaws designed for reaching into tight, confined spaces and bending fine wire with accuracy. Made from chrome vanadium steel with induction-hardened cutting edges that cleanly sever copper, brass, and steel wire without crushing or fraying. The slim jaw profile tapers to a fine point, making these pliers indispensable for electrical terminal work, jewelry making, and intricate mechanical repairs. Bi-component comfort grips minimize hand strain during detailed tasks requiring a steady hand and controlled pressure. The leaf-spring joint returns the handles to the open position automatically, speeding up repetitive tasks. A must-have precision tool trusted by electricians, electronics technicians, and hobbyists worldwide.",
      "price": 14.24,
      "is_location_offer": false,
      "is_rental": false,
      "co2_rating": "D",
      "in_stock": false,
      "is_eco_friendly": false,
      "product_image": {
        "id": "01KVEP986M26MNZ7QSG621QAAM",
        "by_name": "Brett Jordan",
        "by_url": "https://unsplash.com/@brett_jordan",
        "source_name": "Unsplash",
        "source_url": "https://unsplash.com/photos/GamuDTVm02g",
        "file_name": "pliers04.avif",
        "title": "Long nose pliers"
      },
      "category": {
        "id": "01KVEP9863WWC7EBS954M702AD",
        "name": "Pliers",
        "slug": "pliers"
      },
      "brand": {
        "id": "01KVEP97TT8Q9YGVPA8ND72MTT",
        "name": "MightyCraft Hardware"
      }
    },
    {
      "id": "01KVEP987Z57W6JY00PZTATVX8",
      "name": "Slip Joint Pliers",
      "description": "Adjustable slip joint pliers that feature a two-position pivot mechanism for switching between regular and wide jaw openings to accommodate different fastener sizes. The PVC-coated handles offer a comfortable, non-slip grip while the precisely machined jaws securely grasp round, flat, and hexagonal objects without slipping. Constructed from durable drop-forged carbon steel that has been heat-treated to withstand heavy daily use in professional environments. The curved jaw section grips pipes and cylindrical objects, while the flat front surface handles nuts, bolts, and sheet materials. A wire cutter integrated near the pivot handles light cutting tasks without reaching for a separate tool. Perfect for plumbing, automotive, HVAC, and general maintenance work where a single versatile gripping tool saves time.",
      "price": 9.17,
      "is_location_offer": false,
      "is_rental": false,
      "co2_rating": "D",
      "in_stock": true,
      "is_eco_friendly": false,
      "product_image": {
        "id": "01KVEP986M26MNZ7QSG621QAAN",
        "by_name": "Yasin Hasan",
        "by_url": "https://unsplash.com/@yasin",
        "source_name": "Unsplash",
        "source_url": "https://unsplash.com/photos/dwlxTSpfKXg",
        "file_name": "pliers05.avif",
        "title": "Slip joint pliers"
      },
      "category": {
        "id": "01KVEP9863WWC7EBS954M702AD",
        "name": "Pliers",
        "slug": "pliers"
      },
      "brand": {
        "id": "01KVEP97TT8Q9YGVPA8ND72MTT",
        "name": "MightyCraft Hardware"
      }
    },
    {
      "id": "01KVEP98817E6H29GEC13RWYBN",
      "name": "Claw Hammer with Shock Reduction Grip",
      "description": "Ergonomic claw hammer featuring an advanced shock reduction grip system that absorbs up to 70% of impact vibrations, protecting your wrist, elbow, and shoulder during prolonged nailing sessions. The 450g carbon steel head is precision-balanced and heat-treated for maximum hardness, ensuring accurate nail driving with minimal effort on every swing. The curved claw design effortlessly removes nails without damaging surrounding wood surfaces, making it equally useful for construction and renovation work. A fiberglass-reinforced handle combines lightweight strength with exceptional durability that far outlasts traditional wooden handles. The overmolded soft-grip zone conforms to your hand shape for a custom-feeling, fatigue-free hold throughout long working days. Recommended for professional framing, carpentry, and renovation projects where operator comfort matters as much as striking performance.",
      "price": 13.41,
      "is_location_offer": true,
      "is_rental": false,
      "co2_rating": "D",
      "in_stock": true,
      "is_eco_friendly": false,
      "product_image": {
        "id": "01KVEP986M26MNZ7QSG621QAAP",
        "by_name": "iMattSmart",
        "by_url": "https://unsplash.com/@imattsmart",
        "source_name": "Unsplash",
        "source_url": "https://unsplash.com/photos/jaLaLQdkBOE",
        "file_name": "hammer01.avif",
        "title": "Claw Hammer"
      },
      "category": {
        "id": "01KVEP9863WWC7EBS954M702A9",
        "name": "Hammer",
        "slug": "hammer"
      },
      "brand": {
        "id": "01KVEP97TT8Q9YGVPA8ND72MTS",
        "name": "ForgeFlex Tools"
      }
    },
    {
      "id": "01KVEP9889JD0X9E7MRHQT0S5S",
      "name": "Hammer",
      "description": "A dependable standard claw hammer suitable for driving and removing nails in everyday construction, carpentry, and home improvement projects. The 350g carbon steel head is drop-forged and heat-treated for maximum hardness, then fitted to a traditional wooden handle that provides natural shock absorption with each strike. Well-balanced weight distribution between the head and handle ensures accurate strikes with minimal wrist effort, reducing fatigue during repetitive nailing tasks. The polished face resists rust and provides a smooth surface that drives nails cleanly without leaving marks on finish materials. A gently curved claw provides reliable nail extraction leverage without excessive force. This versatile hammer belongs in every toolbox, from professional carpentry workshops to home garages and apartment maintenance kits.",
      "price": 12.58,
      "is_location_offer": false,
      "is_rental": false,
      "co2_rating": "D",
      "in_stock": true,
      "is_eco_friendly": false,
      "product_image": {
        "id": "01KVEP986M26MNZ7QSG621QAAQ",
        "by_name": "Jozsef Hocza",
        "by_url": "https://unsplash.com/@hocza",
        "source_name": "Unsplash",
        "source_url": "https://unsplash.com/photos/D3nouOYbALc",
        "file_name": "hammer02.avif",
        "title": "Hammer"
      },
      "category": {
        "id": "01KVEP9863WWC7EBS954M702A9",
        "name": "Hammer",
        "slug": "hammer"
      },
      "brand": {
        "id": "01KVEP97TT8Q9YGVPA8ND72MTS",
        "name": "ForgeFlex Tools"
      }
    },
    {
      "id": "01KVEP988DZKQD20Y13E0JAPTB",
      "name": "Claw Hammer",
      "description": "Traditional claw hammer with a polished carbon steel head engineered for driving and removing nails with precision and confidence. The rubber-wrapped handle provides a secure, comfortable grip even in wet, dusty, or cold conditions where bare metal or wood handles would slip. At 500g, it offers the ideal balance between striking power and maneuverability for general carpentry, framing, and construction tasks. The curved claw design allows for smooth nail extraction without gouging or marring wood surfaces, protecting your finished work. The head-to-handle connection uses an epoxy-bonded wedge system that prevents loosening over time. A reliable, no-nonsense tool that professional carpenters and weekend builders alike reach for every day.",
      "price": 11.48,
      "is_location_offer": true,
      "is_rental": false,
      "co2_rating": "D",
      "in_stock": true,
      "is_eco_friendly": false,
      "product_image": {
        "id": "01KVEP986M26MNZ7QSG621QAAR",
        "by_name": "Andrew George",
        "by_url": "https://unsplash.com/@andrewjoegeorge",
        "source_name": "Unsplash",
        "source_url": "https://unsplash.com/photos/YU2mCvXR0wA",
        "file_name": "hammer03.avif",
        "title": "Claw Hammer"
      },
      "category": {
        "id": "01KVEP9863WWC7EBS954M702A9",
        "name": "Hammer",
        "slug": "hammer"
      },
      "brand": {
        "id": "01KVEP97TT8Q9YGVPA8ND72MTT",
        "name": "MightyCraft Hardware"
      }
    },
    {
      "id": "01KVEP988FKSK30MYKBFPDD66Y",
      "name": "Thor Hammer",
      "description": "The legendary Thor Hammer combines premium craftsmanship with raw striking power in a tool that is truly built to last generations. Forged from Uru metal with a hand-wrapped leather grip, this extraordinary 5kg masterpiece delivers unmatched impact force for the most demanding demolition, forging, and heavy construction tasks. The perfectly balanced oversized head ensures every swing transfers maximum energy to the target, while the enlarged striking face covers more surface area than any conventional hammer. Despite its impressive mass, the ergonomic handle design and precise weight distribution allow for surprisingly controlled, accurate swings. This is not merely a tool but a statement piece for those who accept nothing less than the absolute best in their workshop. Comes with a lifetime warranty because true legends never fade. Please note: only one Thor Hammer is permitted per customer.",
      "price": 11.14,
      "is_location_offer": false,
      "is_rental": false,
      "co2_rating": "D",
      "in_stock": true,
      "is_eco_friendly": false,
      "product_image": {
        "id": "01KVEP986M26MNZ7QSG621QAAS",
        "by_name": "ANIRUDH",
        "by_url": "https://unsplash.com/@lanirudhreddy",
        "source_name": "Unsplash",
        "source_url": "https://unsplash.com/photos/3esjG-nlgyk",
        "file_name": "hammer04.avif",
        "title": "Hammer"
      },
      "category": {
        "id": "01KVEP9863WWC7EBS954M702A9",
        "name": "Hammer",
        "slug": "hammer"
      },
      "brand": {
        "id": "01KVEP97TT8Q9YGVPA8ND72MTS",
        "name": "ForgeFlex Tools"
      }
    }
  ],
  "from": 1,
  "last_page": 6,
  "per_page": 9,
  "to": 9,
  "total": 50
}
```

Add first item to cart: 
```shell
curl -X 'POST' \
  'https://api.practicesoftwaretesting.com/carts/01kveqt6qmqvp0wfyhawhy2jm2' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "product_id": "01KVEP987FB1E13RG513RF7H5Q",
  "quantity": 1
}'
```

Response:
```json
{
  "result": "item added or updated"
}
```

Add second item to cart: 
```shell
curl -X 'POST' \
  'https://api.practicesoftwaretesting.com/carts/01kveqt6qmqvp0wfyhawhy2jm2' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "product_id": "01KVEP987QKYEJ9M8BCPT8GN04",
  "quantity": 1
}'
```

Response:
```json
{
  "result": "item added or updated"
}
```

Get cart: 
```shell
curl -X 'GET' \
  'https://api.practicesoftwaretesting.com/carts/01kveqt6qmqvp0wfyhawhy2jm2' \
  -H 'accept: application/json'
```

Response:
```json
{
  "id": "01kveqt6qmqvp0wfyhawhy2jm2",
  "additional_discount_percentage": null,
  "lat": null,
  "lng": null,
  "cart_items": [
    {
      "id": "01kver5r82k6w7xwem8wtdy7j0",
      "quantity": 1,
      "discount_percentage": null,
      "cart_id": "01kveqt6qmqvp0wfyhawhy2jm2",
      "product_id": "01KVEP987FB1E13RG513RF7H5Q",
      "product": {
        "id": "01KVEP987FB1E13RG513RF7H5Q",
        "name": "Combination Pliers",
        "description": "Versatile combination pliers designed for gripping, bending, and cutting wire with ease. Featuring chrome vanadium steel construction with induction-hardened cutting edges, these pliers deliver excellent grip and leverage for a wide range of tasks. The precision-machined jaws combine flat gripping surfaces with a pipe-grip section and integrated wire cutter for true multi-purpose functionality. Ergonomic bi-component handles reduce hand fatigue during extended use and provide a secure hold even with oily or gloved hands. The joint is precisely fitted to eliminate play and ensure smooth operation over thousands of cycles. Ideal for electricians, mechanics, and DIY enthusiasts tackling everyday projects around the workshop or job site.",
        "price": 14.15,
        "is_location_offer": false,
        "is_rental": false,
        "co2_rating": "D",
        "in_stock": true,
        "is_eco_friendly": false
      }
    },
    {
      "id": "01kver742njd9sgyk16ygyqncg",
      "quantity": 1,
      "discount_percentage": null,
      "cart_id": "01kveqt6qmqvp0wfyhawhy2jm2",
      "product_id": "01KVEP987QKYEJ9M8BCPT8GN04",
      "product": {
        "id": "01KVEP987QKYEJ9M8BCPT8GN04",
        "name": "Bolt Cutters",
        "description": "Heavy-duty bolt cutters engineered to slice through hardened bolts, chains, padlocks, and wire fencing with minimal effort. The compound leverage mechanism multiplies your cutting force by a factor of 30, enabling clean cuts through materials up to 10mm in diameter. Hardened alloy steel blades are precisely ground and heat-treated to maintain a sharp edge through years of repeated use on tough materials. Ergonomic rubber grips and the generous 750mm handle length provide excellent control, leverage, and reach during overhead or awkward-angle cuts. An adjustable blade tension screw lets you fine-tune the jaw alignment for optimal cutting performance. Built for demolition crews, locksmiths, fencing contractors, and maintenance professionals who need reliable cutting power day after day.",
        "price": 48.41,
        "is_location_offer": true,
        "is_rental": false,
        "co2_rating": "D",
        "in_stock": true,
        "is_eco_friendly": false
      }
    }
  ]
}
```