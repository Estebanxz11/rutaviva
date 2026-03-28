import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const places = [
  {
    slug: "parque-arvi",
    name: "Parque Arví",
    city: "Medellín",
    country: "Colombia",
    category: "Naturaleza",
    shortDescription:
      "Reserva ecológica de 1.700 hectáreas en las montañas de Santa Elena, accesible por Metrocable.",
    description:
      "Parque Arví es un paraíso natural ubicado en los cerros orientales de Medellín, a 2.400 metros de altura. Con más de 1.700 hectáreas de bosques nativos, quebradas y senderos ecológicos, es el pulmón verde de la ciudad. Puedes llegar a través del innovador Metrocable Línea L. Ofrece senderismo, picnic, mercados campesinos y avistamiento de aves.",
    imageUrl:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    featured: true,
  },
  {
    slug: "pueblito-paisa",
    name: "Pueblito Paisa",
    city: "Medellín",
    country: "Colombia",
    category: "Cultura",
    shortDescription:
      "Réplica de un pueblo antioqueño tradicional en la cima del Cerro Nutibara, con vistas panorámicas.",
    description:
      "Pueblito Paisa es un pintoresco conjunto arquitectónico que recrea la tipología de los pueblos coloniales de Antioquia. Situado en lo alto del Cerro Nutibara a 80 metros sobre el nivel de la ciudad, ofrece espectaculares vistas panorámicas de Medellín. Cuenta con iglesia, alcaldía, barbería, tiendas artesanales y un ambiente festivo auténtico.",
    imageUrl:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80",
    featured: true,
  },
  {
    slug: "comuna-13",
    name: "Comuna 13",
    city: "Medellín",
    country: "Colombia",
    category: "Arte",
    shortDescription:
      "Barrio icónico transformado por el arte urbano, con escaleras eléctricas y murales espectaculares.",
    description:
      "La Comuna 13 es uno de los casos más asombrosos de transformación urbana del mundo. Barrio que pasó de ser uno de los más violentos a convertirse en un referente de arte, cultura y turismo. Sus escaleras eléctricas al aire libre, murales callejeros, hip-hop en vivo y grafitis narran la historia de la comunidad. Un tour obligatorio en Medellín.",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    featured: true,
  },
  {
    slug: "jardin-botanico",
    name: "Jardín Botánico",
    city: "Medellín",
    country: "Colombia",
    category: "Naturaleza",
    shortDescription:
      "Uno de los parques urbanos más hermosos de Colombia, con el majestuoso Orquideorma.",
    description:
      "El Jardín Botánico Joaquín Antonio Uribe es un oasis verde en el corazón de Medellín. Alberga más de 4.500 especies de plantas tropicales y el icónico Orquideorma, una estructura de madera inspirada en las orquídeas. Perfecto para relajarse, hacer picnic, asistir a conciertos y exposiciones. Entrada gratuita.",
    imageUrl:
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
    featured: true,
  },
  {
    slug: "museo-antioquia",
    name: "Museo de Antioquia",
    city: "Medellín",
    country: "Colombia",
    category: "Historia",
    shortDescription:
      "Fundado en 1881, alberga la mayor colección de obras de Fernando Botero y arte colonial.",
    description:
      "El Museo de Antioquia es uno de los museos más importantes de Colombia y el más antiguo del departamento. Fundado en 1881, alberga una extraordinaria colección de arte que incluye más de 100 obras donadas por el maestro Fernando Botero: pinturas, esculturas y dibujos. También cuenta con arte precolombino, colonial e independentista.",
    imageUrl:
      "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&q=80",
    featured: true,
  },
  {
    slug: "plaza-botero",
    name: "Plaza Botero",
    city: "Medellín",
    country: "Colombia",
    category: "Arte",
    shortDescription:
      "Plaza al aire libre con 23 esculturas monumentales donadas por Fernando Botero.",
    description:
      "La Plaza de las Esculturas, conocida como Plaza Botero, es un espacio público vibrante en el centro de la ciudad. Alberga 23 monumentales esculturas de bronce donadas por el internacionalmente reconocido artista Fernando Botero. La gente local y los turistas se congregan aquí para admirar el arte, tomar fotos y disfrutar del ambiente urbano.",
    imageUrl:
      "https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80",
    featured: true,
  },
  {
    slug: "el-poblado",
    name: "El Poblado",
    city: "Medellín",
    country: "Colombia",
    category: "Entretenimiento",
    shortDescription:
      "Barrio cosmopolita con la mejor vida nocturna, restaurantes y bares de la ciudad.",
    description:
      "El Poblado es el barrio más exclusivo y cosmopolita de Medellín. Centro de la vida nocturna de la ciudad, cuenta con cientos de restaurantes internacionales, bares de moda, discotecas y hoteles boutique. La Zona Rosa y el Parque Lleras son sus puntos más animados. También hay galerías de arte, spas y centros comerciales.",
    imageUrl:
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
    featured: false,
  },
  {
    slug: "mercado-del-rio",
    name: "Mercado del Río",
    city: "Medellín",
    country: "Colombia",
    category: "Gastronomía",
    shortDescription:
      "El mayor mercado gastronómico de Colombia con más de 40 propuestas culinarias.",
    description:
      "Mercado del Río es el epicentro gastronómico de Medellín. Con más de 40 estaciones de comida en un espacio industrial rehabilitado, ofrece una experiencia culinaria única que va desde cocina colombiana tradicional hasta fusion asiática, italiana y mediterránea. Ambiente festivo, barras de cócteles artesanales y animación en vivo los fines de semana.",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    featured: false,
  },
  {
    slug: "metrocable-linea-k",
    name: "Metrocable Línea K",
    city: "Medellín",
    country: "Colombia",
    category: "Cultura",
    shortDescription:
      "Teleférico urbano que conecta el metro con los barrios de la ladera, con vistas increíbles.",
    description:
      "El Metrocable Línea K es un hito de ingeniería social y urbana que revolucionó la movilidad en Medellín. Conecta la estación Acevedo del Metro con los barrios de Aranjuez, Miranda y Santo Domingo Savio en las laderas de la ciudad. Los 16 minutos de viaje ofrecen vistas panorámicas espectaculares y son una experiencia que mezcla turismo con vida cotidiana real.",
    imageUrl:
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=800&q=80",
    featured: false,
  },
  {
    slug: "parque-explora",
    name: "Parque Explora",
    city: "Medellín",
    country: "Colombia",
    category: "Cultura",
    shortDescription:
      "Innovador museo interactivo de ciencia y tecnología con acuario y planetario.",
    description:
      "Parque Explora es un centro interactivo de ciencia y tecnología de clase mundial. Cuenta con más de 300 experiencias interactivas distribuidas en cuatro edificios, el acuario más grande de Colombia con más de 400 especies marinas, un planetario digital de última generación y una sala de tormentas eléctricas. Perfecto para todas las edades.",
    imageUrl:
      "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80",
    featured: false,
  },
  {
    slug: "laureles",
    name: "Barrio Laureles",
    city: "Medellín",
    country: "Colombia",
    category: "Gastronomía",
    shortDescription:
      "El barrio más chill de Medellín con ciclovía, cafés especiales y restaurantes locales.",
    description:
      "Laureles es el barrio residencial más querido de Medellín por locales y visitantes. Su Avenida El Poblado, conocida como el corredor gastronómico y ciclístico, está flanqueada por enormes árboles y repleta de cafés de especialidad, restaurantes de autor, bares tranquilos y tiendas. Los domingos, la ciclovía lo convierte en el lugar perfecto para pasear.",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    featured: false,
  },
  {
    slug: "catedral-metropolitana",
    name: "Catedral Metropolitana",
    city: "Medellín",
    country: "Colombia",
    category: "Religioso",
    shortDescription:
      "Una de las construcciones de ladrillo más grandes del mundo y símbolo de Medellín.",
    description:
      "La Catedral Basílica Metropolitana de Medellín es un impresionante templo neorrománico que se destaca por ser una de las edificaciones de ladrillo más grandes del mundo, con más de 1,1 millones de ladrillos en su construcción. Sede del arzobispado de Medellín, domina el Parque de Bolívar y es un símbolo arquitectónico e histórico de la ciudad.",
    imageUrl:
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    featured: false,
  },
  {
    slug: "guatape",
    name: "El Peñol y Guatapé",
    city: "Medellín",
    country: "Colombia",
    category: "Aventura",
    shortDescription:
      "Monolito de roca de 200 metros de altura y el colorido pueblo más fotogénico de Colombia.",
    description:
      "Guatapé es una excursión de día imprescindible desde Medellín, a 79 km. La gran roca El Peñol, un monolito granítico de 200 metros de altura con 740 peldaños hasta la cima, ofrece vistas de 360° sobre el embalse. El pueblo de Guatapé destaca por sus zócalos coloridos y fascinantes, restaurantes de trucha fresca y paseos en lancha.",
    imageUrl:
      "https://images.unsplash.com/photo-1598459030786-5fa0b457c2ef?w=800&q=80",
    featured: false,
  },
  {
    slug: "estadio-atanasio",
    name: "Estadio Atanasio Girardot",
    city: "Medellín",
    country: "Colombia",
    category: "Entretenimiento",
    shortDescription:
      "Escenario deportivo y cultural icónico, sede de los partidos del Atlético Nacional y DIM.",
    description:
      "El Estadio Atanasio Girardot es el corazón deportivo de Medellín y one of the most iconic in South America. Sede de los equipos locales Atlético Nacional y Deportivo Independiente Medellín, tiene capacidad para 45.000 espectadores. En días de partido, el ambiente es electrizante. También alberga grandes conciertos internacionales.",
    imageUrl:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
    featured: false,
  },
  {
    slug: "santa-fe",
    name: "Centro Comercial Santa Fe",
    city: "Medellín",
    country: "Colombia",
    category: "Entretenimiento",
    shortDescription:
      "El centro comercial más grande de Colombia con más de 700 tiendas y entretenimiento.",
    description:
      "El Centro Comercial Santa Fe es el más grande de Colombia y uno de los más grandes de Latinoamérica, con más de 760 establecimientos, cines, zona de comidas internacional, parques temáticos para niños, hoteles, oficinas y un ambiente completamente integrado. Es también un referente arquitectónico con su diseño moderno y espacios verdes interiores.",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    featured: false,
  },
  {
    slug: "cerro-nutibara",
    name: "Cerro Nutibara",
    city: "Medellín",
    country: "Colombia",
    category: "Naturaleza",
    shortDescription:
      "Colina boscosa urbana con senderos, anfiteatro al aire libre y vistas de la ciudad.",
    description:
      "El Cerro Nutibara es un espacio natural de 32 hectáreas ubicado en el barrio Nutibara, al suroccidente de Medellín. Ofrece senderos ecológicos entre bosques de eucalipto, un anfiteatro al aire libre que alberga eventos culturales y conciertos, el Parque de las Esculturas con obras de artistas latinoamericanos y el Pueblito Paisa en su cima.",
    imageUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80",
    featured: false,
  },
  {
    slug: "parque-bello",
    name: "Parque de las Luces",
    city: "Medellín",
    country: "Colombia",
    category: "Cultura",
    shortDescription:
      "300 columnas de luz en el corazón del centro histórico de Medellín, espectacular de noche.",
    description:
      "El Parque de las Luces, conocido también como Plaza de la Luz, es una renovación urbana extraordinaria del centro histórico de Medellín. 300 columnas de cristal que se iluminan de noche transforman la plaza en un espectáculo visual único. Integra la Biblioteca EPM y el Centro Cultural de Medellín, siendo punto de encuentro y referente del urbanismo progresista paisa.",
    imageUrl:
      "https://images.unsplash.com/photo-1531565637446-32307b194362?w=800&q=80",
    featured: false,
  },
  {
    slug: "castillo-museo",
    name: "Castillo Museo",
    city: "Medellín",
    country: "Colombia",
    category: "Historia",
    shortDescription:
      "Castillo medieval del siglo XX con colecciones de arte europeo y jardines espectaculares.",
    description:
      "El Castillo, o Museo El Castillo, es una joya arquitectónica construida en 1930 en estilo neogótico francés. Rodeado de jardines formales de estilo francés con fuentes y esculturas, alberga una extraordinary colección de muebles y arte europeo del siglo XVIII y XIX. Es uno de los museos más originales y bellos de Colombia.",
    imageUrl:
      "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80",
    featured: false,
  },

  // ── Bogotá ──────────────────────────────────────────────────────────────
  {
    slug: "candelaria-bogota",
    name: "La Candelaria",
    city: "Bogotá",
    country: "Colombia",
    category: "Historia",
    shortDescription: "Barrio histórico fundacional de Bogotá, lleno de museos, murales y arquitectura colonial.",
    description: "La Candelaria es el corazón histórico de Bogotá, donde la ciudad fue fundada en 1538. Sus calles empedradas están bordadas de casas coloniales de colores vibrantes que hoy albergan el Museo del Oro, la Casa de Nariño y la Plaza de Bolívar. Es el epicentro cultural de la capital, con galerías, cafés literarios y una vibrante escena artística callejera.",
    imageUrl: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&q=80",
    featured: true,
  },
  {
    slug: "museo-del-oro",
    name: "Museo del Oro",
    city: "Bogotá",
    country: "Colombia",
    category: "Cultura",
    shortDescription: "El museo de orfebrería precolombina más importante del mundo con más de 55.000 piezas.",
    description: "El Museo del Oro del Banco de la República es una de las colecciones de metalurgia precolombina más grandes del planeta, con más de 55.000 piezas de oro y otros metales. Fundado en 1939, sus salas narran la cosmología y ritos sagrados de las culturas indígenas colombianas. La Sala de la Ofrenda y la sala del Tunjo son experiencias visuales transformadoras.",
    imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80",
    featured: true,
  },
  {
    slug: "monserrate-bogota",
    name: "Cerro de Monserrate",
    city: "Bogotá",
    country: "Colombia",
    category: "Religioso",
    shortDescription: "Santuario a 3.152 m con vistas panorámicas de toda Bogotá, accesible por teleférico o funicular.",
    description: "El Cerro de Monserrate es el mirador natural más emblemático de Bogotá, coronado por un santuario dedicado al Señor Caído, una figura religiosa muy venerada. A 3.152 metros sobre el nivel del mar, ofrece vistas espectaculares de toda la sabana. Se puede ascender en teleférico, funicular o a pie por senderos rodeados de vegetación de páramo.",
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    featured: true,
  },
  {
    slug: "usaquen-bogota",
    name: "Usaquén",
    city: "Bogotá",
    country: "Colombia",
    category: "Gastronomía",
    shortDescription: "Antiguo municipio absorbido por la ciudad, hoy barrio gourmet con mercado de pulgas dominical.",
    description: "Usaquén es el barrio más encantador de Bogotá, con su iglesia colonial del siglo XVII, casas blancas de cal y una plaza central de gran ambiente. Los domingos cobra vida con el famoso mercado de pulgas lleno de artesanías, antigüedades y comida. Su zona rosa concentra restaurantes de alta cocina, bares y cafeterías con encanto.",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    featured: false,
  },
  {
    slug: "ciclovía-bogota",
    name: "Ciclovía de Bogotá",
    city: "Bogotá",
    country: "Colombia",
    category: "Aventura",
    shortDescription: "Evento dominical que cierra 121 km de vías a los carros, abiertos a ciclistas y peatones.",
    description: "La Ciclovía de Bogotá es un fenómeno social y deportivo sin igual en el mundo: cada domingo y festivo 121 kilómetros de las principales avenidas de la ciudad se cierran al tráfico vehicular. Desde 1974, más de 2 millones de bogotanos salen a caminar, correr, andar en bici y bailar salsa en las calles. Es la experiencia más auténtica de la cultura bogotana.",
    imageUrl: "https://images.unsplash.com/photo-1598459030786-5fa0b457c2ef?w=800&q=80",
    featured: false,
  },
  {
    slug: "museo-botero",
    name: "Museo Botero",
    city: "Bogotá",
    country: "Colombia",
    category: "Arte",
    shortDescription: "Donación de Fernando Botero al país: 208 obras del maestro y 123 obras de arte internacional.",
    description: "El Museo Botero alberga la colección más importante de Fernando Botero, quien donó 208 de sus propias obras y 123 piezas de grandes maestros internacionales incluyendo Picasso, Monet, Dalí y Renoir, todo al pueblo colombiano. Ubicado en La Candelaria en una elegante casona colonial, es uno de los museos gratuitos más visitados de América Latina.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    featured: false,
  },
  {
    slug: "chico-zona-rosa",
    name: "Zona Rosa - El Chico",
    city: "Bogotá",
    country: "Colombia",
    category: "Entretenimiento",
    shortDescription: "El corazón cosmopolita de Bogotá con centros comerciales, restaurantes de clase mundial y vida nocturna.",
    description: "La Zona Rosa y El Chico forman el centro de la vida nocturna y gastronómica de Bogotá. La Calle 85, el Parque de la 93 y el Andino concentran las mejores opciones de restaurantes con chefs internacionales, coctelería de autor, clubes y el barrio T, epicentro del diseño de moda colombiano. Es el Soho bogotano, elegante y cosmopolita.",
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
    featured: false,
  },
  {
    slug: "parque-simon-bolivar",
    name: "Parque Simón Bolívar",
    city: "Bogotá",
    country: "Colombia",
    category: "Naturaleza",
    shortDescription: "El 'Central Park' de Bogotá: 110 hectáreas de verde urbano con lago y sede de festivales masivos.",
    description: "El Parque Simón Bolívar es el parque urbano más grande e importante de Bogotá con 110 hectáreas de senderos, jardines, un lago central y canchas deportivas. Es el escenario de los grandes festivales de la ciudad como el Festival Estéreo Picnic y el Concierto de Año Nuevo. Los fines de semana se llena de familias, deportistas y músicos callejeros.",
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    featured: false,
  },

  // ── Cartagena ──────────────────────────────────────────────────────────
  {
    slug: "ciudad-amurallada-cartagena",
    name: "Ciudad Amurallada",
    city: "Cartagena",
    country: "Colombia",
    category: "Historia",
    shortDescription: "Patrimonio de la Humanidad UNESCO: fortaleza colonial del siglo XVI con murallas de 13 km.",
    description: "La Ciudad Amurallada de Cartagena es Patrimonio de la Humanidad de la UNESCO y una de las ciudades coloniales mejor preservadas de América. Sus 13 kilómetros de murallas construidas entre los siglos XVI y XVII rodean un laberinto de calles adoquinadas, plazas floridas, iglesias barrocas y mansiones señoriales con balcones rebosantes de bougainvillea.",
    imageUrl: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&q=80",
    featured: true,
  },
  {
    slug: "castillo-san-felipe",
    name: "Castillo San Felipe de Barajas",
    city: "Cartagena",
    country: "Colombia",
    category: "Historia",
    shortDescription: "La fortaleza más grande construida por España en América, declarada Patrimonio UNESCO.",
    description: "El Castillo San Felipe de Barajas es la obra de ingeniería militar más importante de la época colonial española en el Nuevo Mundo. Construido sobre el Cerro de San Lázaro, sus túneles subterráneos, bastiones y cañones narran siglos de batallas y asedios. Junto a la Ciudad Amurallada forma el conjunto defensivo que protegió el puerto de piratas y corsarios.",
    imageUrl: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800&q=80",
    featured: true,
  },
  {
    slug: "bocagrande-cartagena",
    name: "Bocagrande",
    city: "Cartagena",
    country: "Colombia",
    category: "Entretenimiento",
    shortDescription: "El barrio moderno de Cartagena con playas urbanas, hoteles de lujo y la mejor vida nocturna del Caribe.",
    description: "Bocagrande es el sector moderno de Cartagena, una península llena de torres hoteleras, restaurantes de mariscos, bares de playa y discotecas. Su playa urbana, aunque concurrida, tiene el ambiente caribeño más festivo de la ciudad. Por las noches, la Avenida San Martín se convierte en una pasarela de vida nocturna con música vallenata y DJ internacionales.",
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
    featured: false,
  },
  {
    slug: "islas-del-rosario",
    name: "Islas del Rosario",
    city: "Cartagena",
    country: "Colombia",
    category: "Naturaleza",
    shortDescription: "Archipiélago de 27 islas coralinas en Parque Nacional con aguas turquesa cristalinas.",
    description: "Las Islas del Rosario son un archipiélago de 27 pequeñas islas coralinas ubicadas a 35 km de Cartagena, protegidas como Parque Nacional Natural Corales del Rosario. Sus aguas de color turquesa perfecto albergan arrecifes de coral con una biodiversidad marina extraordinaria. Perfectas para snorkel, buceo, kayak y simplemente descansar en playas de arena blanca.",
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    featured: true,
  },
  {
    slug: "getsemani-cartagena",
    name: "Getsemaní",
    city: "Cartagena",
    country: "Colombia",
    category: "Arte",
    shortDescription: "Barrio bohemio extramuros lleno de murales, bares coloridos y la auténtica alma cartagenera.",
    description: "Getsemaní es el barrio más auténtico y vibrante de Cartagena, ubicado extramuros de la Ciudad Amurallada. Transformado en los últimos años por artistas locales e internacionales, sus paredes son un museo de arte urbano al aire libre. Por las noches su plaza Trinidad se convierte en la sala de estar más famosa del Caribe, con música, libaciones y encuentros culturales.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    featured: false,
  },
  {
    slug: "playa-blanca-cartagena",
    name: "Playa Blanca",
    city: "Cartagena",
    country: "Colombia",
    category: "Aventura",
    shortDescription: "La playa más famosa de Colombia en la Isla Barú: arena blanca impecable y aguas turquesa.",
    description: "Playa Blanca en la Isla Barú es considerada una de las playas más hermosas de Colombia. Su arena blanca finísima contrasta con las aguas turquesa cristalinas del mar Caribe. Se llega en lancha desde Cartagena en 45 minutos. La playa está bordeada de palmas de coco y kioscos que sirven langosta fresca, pargo rojo y cocadas recién hechas.",
    imageUrl: "https://images.unsplash.com/photo-1598459030786-5fa0b457c2ef?w=800&q=80",
    featured: false,
  },
  {
    slug: "convento-popa-cartagena",
    name: "Convento de La Popa",
    city: "Cartagena",
    country: "Colombia",
    category: "Religioso",
    shortDescription: "Convento agustino del siglo XVII en el cerro más alto de Cartagena con vistas a 360°.",
    description: "El Convento de Nuestra Señora de la Candelaria de La Popa, construido en 1607 por los frailes agustinos, corona el cerro más alto de Cartagena a 150 metros de altura. Ofrece las más espectaculares vistas panorámicas de la ciudad, la bahía, las islas y el mar Caribe. Su capilla guarda la imagen de la Virgen de la Candelaria, patrona de Cartagena.",
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    featured: false,
  },

  // ── Cali ───────────────────────────────────────────────────────────────
  {
    slug: "salsa-cali",
    name: "Barrio Juanchito y Tiendas de Salsa",
    city: "Cali",
    country: "Colombia",
    category: "Entretenimiento",
    shortDescription: "La capital mundial de la salsa: bailaderos, escuelas y el estilo caleño único.",
    description: "Cali es la capital mundial indiscutible de la salsa. Su estilo particular —con movimientos de pies rápidos y figuras aéreas— es reconocido globalmente. El barrio Juanchito y los tradicionales 'salsódromos' como Tin Tin Deo son templos del baile donde locales y turistas se rinden ante el ritmo. El Festival Mundial de Salsa cada año desborda la ciudad.",
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80",
    featured: true,
  },
  {
    slug: "cristo-rey-cali",
    name: "Cristo Rey",
    city: "Cali",
    country: "Colombia",
    category: "Religioso",
    shortDescription: "Monumento icónico de 26 metros en el cerro que domina el skyline de Cali.",
    description: "El Cristo Rey de Cali es un monumento de 26 metros de altura erigido en 1953 en honor a las víctimas de la Primera Guerra Mundial. Ubicado en el Cerro Los Cristales a 1.470 metros de altura, domina el horizonte de la ciudad y ofrece vistas panorámicas del Valle del Cauca. La subida al cerro, rodeada de guadua y vegetación tropical, es un recorrido muy popular.",
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80",
    featured: false,
  },
  {
    slug: "jardin-botanico-cali",
    name: "Jardín Botánico Juan María Céspedes",
    city: "Cali",
    country: "Colombia",
    category: "Naturaleza",
    shortDescription: "Oasis verde urbano con colecciones de orquídeas colombianas, bromelias y palmas tropicales.",
    description: "El Jardín Botánico Juan María Céspedes es el pulmón verde de Cali: 10 hectáreas de biodiversidad tropical en plena ciudad. Sus colecciones incluyen cientos de especies de orquídeas, heliconias, palmas, bambúes y plantas medicinales. El mariposario y las sendas entre estanques con peces y aves lo convierten en un refugio natural que sorprende a propios y visitantes.",
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    featured: false,
  },
  {
    slug: "san-antonio-cali",
    name: "Barrio San Antonio",
    city: "Cali",
    country: "Colombia",
    category: "Cultura",
    shortDescription: "El barrio más bohemio de Cali con casas republicanas, galerías de arte y cafés artesanales.",
    description: "San Antonio es el barrio con más encanto de Cali, un cerro cubierto de casas republicanas de colores que albergan galerías de arte, restaurantes gourmet y cafeterías con música en vivo. La iglesia de San Antonio del siglo XVIII domina la colina, y su parque es el punto de encuentro de artistas, estudiantes y viajeros que buscan el alma auténtica de la ciudad.",
    imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80",
    featured: false,
  },
  {
    slug: "lago-calima",
    name: "Lago Calima",
    city: "Cali",
    country: "Colombia",
    category: "Aventura",
    shortDescription: "Embalse a 2 horas de Cali, paraíso del windsurf, kitesurf y deportes náuticos.",
    description: "El Lago Calima, también llamado Embalse Calima, es uno de los destinos de aventura más populares del occidente colombiano, a tan solo 2 horas de Cali. Sus vientos constantes lo han convertido en uno de los mejores lugares de windsurf y kitesurf de Sudamérica. También ofrece kayak, paddleboard, pesca y paseos en lancha entre paisajes de montaña exuberante.",
    imageUrl: "https://images.unsplash.com/photo-1598459030786-5fa0b457c2ef?w=800&q=80",
    featured: false,
  },

  // ── Santa Marta / Tayrona ──────────────────────────────────────────────
  {
    slug: "parque-tayrona",
    name: "Parque Nacional Tayrona",
    city: "Santa Marta",
    country: "Colombia",
    category: "Naturaleza",
    shortDescription: "Paraíso donde la selva tropical se funde con el Caribe: playas vírgenes y cultura Tairona.",
    description: "El Parque Nacional Natural Tayrona es uno de los parques más visitados de Colombia y uno de los más espectaculares de América Latina. Sus 15.000 hectáreas combinan selva tropical densa, playas de arena dorada con aguas turquesa y los vestigios de la ancestral cultura Tairona. Las bahías de Cabo San Juan, Arrecifes y La Piscina son postales perfectas del paraíso caribeño.",
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    featured: true,
  },
  {
    slug: "ciudad-perdida-tayrona",
    name: "Ciudad Perdida (Teyuna)",
    city: "Santa Marta",
    country: "Colombia",
    category: "Historia",
    shortDescription: "Trek de 4 días a la ciudad sagrada Tairona del siglo IX, más antigua que Machu Picchu.",
    description: "Ciudad Perdida, conocida como Teyuna por los indígenas Kogi, es una de las ciudades precolombinas más grandes de América, construida alrededor del año 800 d.C., unos 650 años antes que Machu Picchu. El trekking de 4-6 días a través de la selva de la Sierra Nevada es una de las experiencias de aventura más memorables de Colombia, culminando con 1.200 escalones de piedra.",
    imageUrl: "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800&q=80",
    featured: true,
  },
  {
    slug: "minca-santa-marta",
    name: "Minca",
    city: "Santa Marta",
    country: "Colombia",
    category: "Aventura",
    shortDescription: "Pueblo eco-turístico en la Sierra Nevada, paraíso de senderismo, cascadas y café de montaña.",
    description: "Minca es un pequeño paraíso escondido en las estribaciones de la Sierra Nevada de Santa Marta, a solo 45 minutos de la ciudad. A 660 metros de altura, ofrece un refrescante contraste con el calor caribeño. Sus cascadas (Pozo Azul, La Victoria), fincas cafeteras, avistamiento de aves, hamacas sobre ríos cristalinos y sunsets sobre el Caribe lo hacen irresistible para viajeros independientes.",
    imageUrl: "https://images.unsplash.com/photo-1598459030786-5fa0b457c2ef?w=800&q=80",
    featured: false,
  },
  {
    slug: "centro-historico-santa-marta",
    name: "Centro Histórico de Santa Marta",
    city: "Santa Marta",
    country: "Colombia",
    category: "Historia",
    shortDescription: "La ciudad más antigua de Colombia fundada en 1525, con la Quinta de San Pedro Alejandrino.",
    description: "Santa Marta fue fundada en 1525, siendo la primera ciudad española en Sudamérica. Su centro histórico conserva la Catedral de Santa Marta —donde yacen los restos originales de Simón Bolívar—, la Quinta de San Pedro Alejandrino donde murió El Libertador, y un malecón renovado con restaurantes de mariscos. La ciudad combina su grandeza histórica con el ambiente caribeño más relajado de Colombia.",
    imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80",
    featured: false,
  },

  // ── Eje Cafetero ──────────────────────────────────────────────────────
  {
    slug: "salento-quindio",
    name: "Salento",
    city: "Salento",
    country: "Colombia",
    category: "Cultura",
    shortDescription: "El pueblo más querido del Eje Cafetero: arquitectura bahareque, trucheras y Valle del Cocora.",
    description: "Salento es el pueblo cafetero más visitado de Colombia y uno de los más bonitos de toda Latinoamérica. Su calle real cubierta de colores, sus casas de bahareque con balcones floridos y sus tiendas de artesanías en madera de palma crean una atmósfera única. A escasos minutos está el Valle del Cocora, hogar de la palma de cera, árbol nacional de Colombia.",
    imageUrl: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80",
    featured: true,
  },
  {
    slug: "valle-del-cocora",
    name: "Valle del Cocora",
    city: "Salento",
    country: "Colombia",
    category: "Naturaleza",
    shortDescription: "Valle nublado con palmas de cera de 60 metros —las más altas del mundo— en paisaje de cuento.",
    description: "El Valle del Cocora es uno de los paisajes más extraordinarios y fotogénicos de Colombia: un valle de niebla donde las palmas de cera (Ceroxylon quindiuense) —las árboles nacionales de Colombia y las palmas más altas del planeta, alcanzando 60 metros— brotan entre prados verdes y nubes bajas. El trekking circular de 4 horas por bosque de niebla es una experiencia única en el mundo.",
    imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
    featured: true,
  },
  {
    slug: "hacienda-cafetera-quindio",
    name: "Hacienda Cafetera",
    city: "Montenegro",
    country: "Colombia",
    category: "Gastronomía",
    shortDescription: "Tour inmersivo en finca cafetera tradicional: cultivo, cosecha y preparación del mejor café del mundo.",
    description: "El Eje Cafetero produce el mejor café de Colombia y hay docenas de haciendas históricas que abren sus puertas para mostrar el proceso completo del café: desde la siembra en ladera, la cosecha manual del grano rojo maduro, el beneficio, el secado y la tostión artesanal hasta la preparación de la taza perfecta. El Parque Nacional del Café en Montenegro es la opción más completa para familias.",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    featured: false,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.userPlace.deleteMany();
  await prisma.tripPlan.deleteMany();
  await prisma.place.deleteMany();
  await prisma.user.deleteMany();

  // Seed places
  for (const place of places) {
    await prisma.place.create({ data: place });
  }

  console.log(`✅ Seeded ${places.length} places`);
  console.log("🎉 Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
