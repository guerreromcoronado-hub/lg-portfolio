-- Seed data para el portfolio de Laura Guerrero
-- Publicaciones de blog y proyectos de ejemplo

-- ======================================
-- BLOG POSTS
-- ======================================

-- Post 1: Email Marketing
INSERT INTO posts (
  title,
  slug,
  excerpt,
  content,
  category,
  emoji,
  published,
  read_time,
  published_at
) VALUES (
  '5 errores que arruinan tu tasa de apertura (y cómo corregirlos)',
  '5-errores-tasa-apertura-email-marketing',
  'Una campaña bien escrita empieza mucho antes de hacer clic en "enviar". Si tu open rate no mejora, probablemente estás cometiendo uno de estos errores.',
  jsonb_build_object(
    'intro', 'El email marketing tiene el ROI más alto de cualquier canal digital. Pero ese promedio esconde una realidad: la mayoría de campañas ni siquiera son abiertas. Si tu tasa de apertura está por debajo del 20%, algo está fallando antes de que el lector vea el contenido.',
    'sections', jsonb_build_array(
      jsonb_build_object(
        'type', 'heading',
        'content', 'Los 5 errores (y sus soluciones)'
      ),
      jsonb_build_object(
        'type', 'error-list',
        'items', jsonb_build_array(
          jsonb_build_object(
            'number', '01',
            'title', 'Usar asuntos genéricos o demasiado "vendedores"',
            'description', 'Asuntos como "¡Oferta especial solo para ti!" ya no engañan a nadie. Los lectores los identifican como spam antes de abrir.',
            'fix', 'Sé específico y curioso. "El email que envié un martes a las 10am y generó 3x más ventas" funciona mejor que cualquier promesa genérica.'
          ),
          jsonb_build_object(
            'number', '02',
            'title', 'Ignorar el preheader (el texto debajo del asunto)',
            'description', 'El preheader es tu segundo asunto. En móvil, esos 40-90 caracteres deciden si alguien abre o no. La mayoría de marcas lo dejan en blanco.',
            'fix', 'Trata el preheader como continuación del asunto. Si el asunto hace una pregunta, el preheader puede ser la promesa de respuesta.'
          ),
          jsonb_build_object(
            'number', '03',
            'title', 'Enviar a toda la lista sin segmentar',
            'description', 'Un suscriptor de hace dos años y uno de ayer no tienen el mismo interés. Enviarles el mismo email a todos daña tu reputación de remitente.',
            'fix', 'Segmenta al menos por fecha de última interacción. Los activos de los últimos 90 días merecen una cadencia diferente.'
          ),
          jsonb_build_object(
            'number', '04',
            'title', 'No hacer A/B testing en el asunto',
            'description', 'Klaviyo, Mailchimp y ActiveCampaign permiten testear dos versiones de asunto y enviar el ganador automáticamente. Casi nadie lo usa.',
            'fix', 'Para cada envío importante, testea una versión directa vs. una con curiosidad. Deja que los datos decidan, no tu instinto.'
          ),
          jsonb_build_object(
            'number', '05',
            'title', 'Enviar siempre el mismo día y hora sin analizar',
            'description', 'No existe un horario universalmente perfecto. Depende de tu audiencia y su rutina. Enviar los martes a las 10am porque "lo leíste en un blog" no es estrategia.',
            'fix', 'Revisa en tu plataforma a qué hora se abren más tus emails. Ese dato ya existe en tus reportes. Úsalo.'
          )
        )
      ),
      jsonb_build_object(
        'type', 'quote',
        'content', 'El open rate no se gana en el cuerpo del email. Se gana en el asunto y en la bandeja de entrada.'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', 'El problema puede estar en la reputación del dominio remitente. Si has enviado a listas sin limpiar, los proveedores te penalizan de manera invisible: tus emails llegan a promociones o al spam sin que lo sepas.'
      ),
      jsonb_build_object(
        'type', 'highlight',
        'title', 'Diagnóstico rápido',
        'content', 'Usa Mail-Tester.com o Google Postmaster Tools para revisar la reputación de tu dominio. Si tu puntuación está por debajo de 7/10, necesitas un plan de warming antes de cualquier otra optimización.'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', 'El email marketing no está muerto. Está mal ejecutado. Con ajustes simples y consistencia, es posible llevar una tasa de apertura del 9% al 35%+ en pocas semanas.'
      )
    )
  ),
  'Email Marketing',
  '📬',
  true,
  '7 min',
  NOW() - INTERVAL '2 weeks'
);

-- Post 2: SEO
INSERT INTO posts (
  title,
  slug,
  excerpt,
  content,
  category,
  emoji,
  published,
  read_time,
  published_at
) VALUES (
  'Guía de SEO para pequeños negocios que no tienen tiempo',
  'guia-seo-pequenos-negocios',
  'No necesitas ser técnico para que Google te encuentre. Aquí lo esencial para empezar con SEO sin complicarte.',
  jsonb_build_object(
    'intro', 'El SEO parece complicado porque la mayoría de guías están escritas para especialistas. Pero si tienes un negocio pequeño, no necesitas dominar todos los conceptos técnicos para empezar a aparecer en Google.',
    'sections', jsonb_build_array(
      jsonb_build_object(
        'type', 'heading',
        'content', 'Lo esencial para empezar'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', 'El SEO tiene tres pilares básicos: contenido relevante, estructura técnica clara, y enlaces de calidad. Para un negocio pequeño, el primero es el más importante.'
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'Las 3 acciones que más impacto generan'
      ),
      jsonb_build_object(
        'type', 'list',
        'items', jsonb_build_array(
          'Escribe contenido que responda preguntas reales de tus clientes',
          'Optimiza tus títulos y descripciones con palabras que la gente busca',
          'Asegúrate de que tu sitio cargue rápido en móvil'
        )
      ),
      jsonb_build_object(
        'type', 'quote',
        'content', 'El mejor SEO es el que tus clientes entienden. Si escribes pensando en Google en lugar de en personas, estás perdiendo el tiempo.'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', 'Una estrategia SEO sencilla pero consistente puede generar más tráfico que campañas pagadas. La diferencia es que los resultados orgánicos se mantienen en el tiempo.'
      )
    )
  ),
  'SEO',
  '🔍',
  true,
  '5 min',
  NOW() - INTERVAL '1 month'
);

-- Post 3: E-commerce
INSERT INTO posts (
  title,
  slug,
  excerpt,
  content,
  category,
  emoji,
  published,
  read_time,
  published_at
) VALUES (
  'Cómo escribir fichas de producto que realmente venden',
  'fichas-producto-que-venden',
  'El copywriting de producto es la diferencia entre el carrito abandonado y la venta. Aquí está la fórmula que funciona.',
  jsonb_build_object(
    'intro', 'Una buena ficha de producto no solo describe. Convence, resuelve objeciones y se anticipa a las preguntas del cliente antes de que abandone la página.',
    'sections', jsonb_build_array(
      jsonb_build_object(
        'type', 'heading',
        'content', 'La estructura que convierte'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', 'Una ficha de producto efectiva tiene tres capas: el beneficio inmediato en el título, las características técnicas en bullet points, y la prueba social o garantía al final.'
      ),
      jsonb_build_object(
        'type', 'heading',
        'content', 'Errores comunes que matan la conversión'
      ),
      jsonb_build_object(
        'type', 'list',
        'items', jsonb_build_array(
          'Hablar solo de características sin explicar beneficios',
          'Usar lenguaje técnico que el cliente no entiende',
          'No incluir información sobre envío o devoluciones',
          'Dejar preguntas sin responder en la descripción'
        )
      ),
      jsonb_build_object(
        'type', 'quote',
        'content', 'La ficha de producto es tu vendedor silencioso. Si no cierra la venta, el diseño bonito no te va a ayudar.'
      ),
      jsonb_build_object(
        'type', 'highlight',
        'title', 'Fórmula práctica',
        'content', 'Título con beneficio + 3-5 bullets con características + Párrafo breve con contexto de uso + Información de envío visible. Esa estructura básica funciona en el 90% de productos.'
      ),
      jsonb_build_object(
        'type', 'paragraph',
        'content', 'El copywriting de producto no necesita ser creativo. Necesita ser claro, útil y persuasivo. En ese orden.'
      )
    )
  ),
  'E-commerce',
  '🛒',
  true,
  '6 min',
  NOW() - INTERVAL '3 weeks'
);

-- ======================================
-- PROYECTOS / CASE STUDIES
-- ======================================

-- Proyecto 1: Email Marketing
INSERT INTO projects (
  title,
  slug,
  excerpt,
  content,
  category,
  tags,
  emoji,
  client,
  services,
  duration,
  year,
  tools,
  metrics,
  results,
  published,
  featured,
  published_at
) VALUES (
  'Reactivamos una lista dormida y generamos un +32% de open rate',
  'reactivacion-lista-email-marketing',
  'Una tienda de moda online tenía 12.000 suscriptores inactivos. Diseñamos una estrategia de reactivación que generó un ROI de 4.2x.',
  jsonb_build_object(
    'context', 'El cliente tenía una lista de más de 12.000 suscriptores que no recibían comunicaciones hace más de ocho meses. La tasa de apertura promedio había caído al 9% y el negocio estaba perdiendo una oportunidad enorme de monetizar esa audiencia ya captada. El reto era claro: ¿cómo volvemos a ganar la atención de personas que ya nos olvidaron, sin quemarlos ni hacer spam?',
    'challenge', 'Reactivar una lista fría sin dañar la reputación del remitente ni generar spam.',
    'solution', jsonb_build_array(
      jsonb_build_object(
        'step', '01',
        'title', 'Auditoría y limpieza de lista',
        'description', 'Identifiqué contactos inactivos, eliminé bounces y segmenté por comportamiento. La lista pasó de 12.000 a 9.800 contactos útiles.'
      ),
      jsonb_build_object(
        'step', '02',
        'title', 'Secuencia de reactivación en 3 pasos',
        'description', 'Email de sorpresa, email de valor con contenido útil, y email de oferta exclusiva con urgencia real.'
      ),
      jsonb_build_object(
        'step', '03',
        'title', 'Copywriting orientado a la persona',
        'description', 'Cada email fue escrito sin vender desde el primer mensaje, generando curiosidad y reconexión emocional.'
      ),
      jsonb_build_object(
        'step', '04',
        'title', 'A/B testing en subject lines',
        'description', 'Testeé dos versiones de asunto por envío. Los datos de las primeras horas guiaron el envío al resto de la lista.'
      )
    ),
    'learnings', 'Una lista fría no es una lista muerta. La clave estuvo en reconocer la pausa y volver con algo de valor real. El copywriting honesto y cercano funcionó mucho mejor que cualquier descuento agresivo.',
    'quote', 'Teníamos 12.000 contactos y no sabíamos qué hacer con ellos. Laura nos ayudó a convertirlos en clientes reales.'
  ),
  'Email Marketing',
  ARRAY['Email Marketing', 'Copywriting', 'Estrategia'],
  '📧',
  'Tienda de moda online',
  'Email Marketing · Copywriting',
  '6 semanas',
  '2024',
  ARRAY['Klaviyo', 'Notion', 'Figma', 'Google Sheets', 'Hotjar'],
  jsonb_build_object(
    'Open rate inicial', '9%',
    'Open rate final', '41%',
    'CTR promedio', '+18%',
    'ROI campaña', '4.2x',
    'Duración', '6 semanas'
  ),
  jsonb_build_object(
    'main', jsonb_build_array(
      jsonb_build_object('value', '+32%', 'label', 'Aumento en open rate general'),
      jsonb_build_object('value', '4.2x', 'label', 'ROI sobre la inversión en la campaña'),
      jsonb_build_object('value', '23%', 'label', 'Tasa de conversión a compra')
    ),
    'summary', 'El open rate pasó del 9% al 41% en el segmento reactivado. El 23% de los contactos que respondieron a la secuencia hicieron una compra en los 30 días siguientes.'
  ),
  true,
  true,
  NOW() - INTERVAL '2 months'
);

-- Proyecto 2: SEO
INSERT INTO projects (
  title,
  slug,
  excerpt,
  content,
  category,
  tags,
  emoji,
  client,
  services,
  duration,
  year,
  tools,
  metrics,
  results,
  published,
  featured,
  published_at
) VALUES (
  'Estrategia SEO para e-commerce — +60% tráfico orgánico en 4 meses',
  'estrategia-seo-ecommerce',
  'Una tienda online de productos naturales necesitaba aumentar su visibilidad. Implementamos una estrategia SEO completa que triplicó el tráfico calificado.',
  jsonb_build_object(
    'context', 'Un e-commerce de productos naturales con buen producto pero poca visibilidad online. Sus competidores directos dominaban los primeros resultados de Google y el tráfico orgánico era casi inexistente.',
    'challenge', 'Posicionar más de 50 fichas de producto en búsquedas relevantes y crear contenido que atrajera tráfico calificado sin presupuesto para publicidad.',
    'solution', jsonb_build_array(
      jsonb_build_object(
        'step', '01',
        'title', 'Auditoría técnica SEO',
        'description', 'Identificamos problemas de velocidad, estructura de URLs y errores de indexación que impedían el posicionamiento.'
      ),
      jsonb_build_object(
        'step', '02',
        'title', 'Investigación de palabras clave',
        'description', 'Mapeamos más de 200 búsquedas relevantes con buen volumen y baja competencia, enfocadas en comprador con intención de compra.'
      ),
      jsonb_build_object(
        'step', '03',
        'title', 'Optimización de fichas de producto',
        'description', 'Reescribimos títulos, descripciones y meta tags de 50+ productos con enfoque en claridad y keywords naturales.'
      ),
      jsonb_build_object(
        'step', '04',
        'title', 'Estrategia de contenido SEO',
        'description', 'Creamos 12 artículos de blog orientados a resolver dudas comunes de la audiencia, enlazando estratégicamente a productos.'
      )
    ),
    'learnings', 'El SEO no es magia, es método. Los resultados llegaron después de la tercera semana, cuando Google empezó a indexar el contenido nuevo. La clave fue ser consistentes y no intentar atajos.',
    'quote', 'En 4 meses pasamos de invisible a primera página. El tráfico orgánico ahora es nuestra principal fuente de clientes.'
  ),
  'SEO',
  ARRAY['SEO', 'Content Strategy', 'E-commerce'],
  '🔍',
  'E-commerce de productos naturales',
  'SEO · Estrategia de Contenido',
  '4 meses',
  '2024',
  ARRAY['Ahrefs', 'Google Search Console', 'Screaming Frog', 'Notion', 'WordPress'],
  jsonb_build_object(
    'Tráfico inicial', '800 visitas/mes',
    'Tráfico final', '2.800 visitas/mes',
    'Keywords top 10', '28',
    'Tasa conversión', '+2.1%',
    'Duración', '4 meses'
  ),
  jsonb_build_object(
    'main', jsonb_build_array(
      jsonb_build_object('value', '+60%', 'label', 'Aumento en tráfico orgánico'),
      jsonb_build_object('value', '28', 'label', 'Keywords en top 10 de Google'),
      jsonb_build_object('value', '3.5x', 'label', 'Incremento en conversiones orgánicas')
    ),
    'summary', 'El tráfico orgánico pasó de 800 a 2,800 visitas mensuales. 28 keywords posicionadas en el top 10 de Google. La tasa de conversión del tráfico orgánico fue 2.1%, superior al promedio del sitio.'
  ),
  true,
  true,
  NOW() - INTERVAL '1 month'
);

-- Proyecto 3: E-commerce Optimization
INSERT INTO projects (
  title,
  slug,
  excerpt,
  content,
  category,
  tags,
  emoji,
  client,
  services,
  duration,
  year,
  tools,
  metrics,
  results,
  published,
  featured,
  published_at
) VALUES (
  'Optimización de fichas de producto — tasa de conversión x2.3',
  'optimizacion-fichas-producto-ecommerce',
  'Un e-commerce con buen tráfico pero pocas ventas. Optimizamos el copywriting y estructura de 40 fichas de producto clave.',
  jsonb_build_object(
    'context', 'Una tienda online de tecnología recibía buen tráfico pero tenía una tasa de conversión del 0.8%, muy por debajo del promedio de su industria. El problema no era el producto ni el precio, sino cómo se comunicaba el valor.',
    'challenge', 'Mejorar la conversión sin cambiar precios ni invertir en más tráfico. El foco estaba en optimizar lo que ya tenían.',
    'solution', jsonb_build_array(
      jsonb_build_object(
        'step', '01',
        'title', 'Análisis de comportamiento con Hotjar',
        'description', 'Grabaciones de sesiones mostraron que usuarios llegaban, leían superficialmente y se iban. Las fichas no respondían preguntas clave.'
      ),
      jsonb_build_object(
        'step', '02',
        'title', 'Identificación de productos prioritarios',
        'description', 'Seleccionamos 40 productos con mayor tráfico y peor conversión. Esos productos concentraban el 65% de las visitas.'
      ),
      jsonb_build_object(
        'step', '03',
        'title', 'Reescritura con estructura clara',
        'description', 'Título con beneficio principal, 5 bullets con características clave, párrafo de contexto de uso, y sección de FAQ anticipando objeciones.'
      ),
      jsonb_build_object(
        'step', '04',
        'title', 'A/B testing en fichas principales',
        'description', 'Testeamos versiones nuevas vs. antiguas en 10 productos clave. Los resultados validaron el enfoque antes de escalar.'
      )
    ),
    'learnings', 'Un copywriting claro vale más que un diseño complejo. Los clientes no quieren creatividad, quieren información útil que les ayude a decidir rápido.',
    'quote', 'No cambió el diseño, no cambió el precio. Solo cambió la forma de explicar el producto y las ventas se duplicaron.'
  ),
  'E-commerce',
  ARRAY['E-commerce', 'Copywriting', 'CRO'],
  '🛒',
  'Tienda online de tecnología',
  'Copywriting · UX Writing · CRO',
  '5 semanas',
  '2024',
  ARRAY['Hotjar', 'Google Analytics', 'Figma', 'Shopify', 'Notion'],
  jsonb_build_object(
    'Conversión inicial', '0.8%',
    'Conversión final', '1.84%',
    'Productos optimizados', '40',
    'Incremento ventas', '+130%',
    'Duración', '5 semanas'
  ),
  jsonb_build_object(
    'main', jsonb_build_array(
      jsonb_build_object('value', 'x2.3', 'label', 'Incremento en tasa de conversión'),
      jsonb_build_object('value', '+130%', 'label', 'Aumento en ventas mensuales'),
      jsonb_build_object('value', '40', 'label', 'Productos optimizados')
    ),
    'summary', 'La tasa de conversión pasó de 0.8% a 1.84%, un incremento de x2.3. Las ventas mensuales aumentaron +130% sin cambiar precios ni aumentar inversión en tráfico.'
  ),
  true,
  false,
  NOW() - INTERVAL '3 months'
);

-- ======================================
-- Views counter (opcional, para demo)
-- ======================================
UPDATE posts SET views = floor(random() * 500 + 100)::int;
