/**
 * Script de utilidad para verificar y cargar datos de prueba
 * 
 * Ejecutar desde la terminal del proyecto:
 * npx ts-node scripts/check-db.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDatabase() {
    console.log('🔍 Verificando base de datos...\n')

    // Verificar posts
    const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('id, title, category, published')
        .order('created_at', { ascending: false })

    if (postsError) {
        console.error('❌ Error al obtener posts:', postsError.message)
    } else {
        console.log(`📝 Posts encontrados: ${posts?.length || 0}`)
        posts?.forEach((post, i) => {
            console.log(`   ${i + 1}. [${post.category}] ${post.title}`)
        })
    }

    console.log('')

    // Verificar projects
    const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, title, category, published')
        .order('created_at', { ascending: false })

    if (projectsError) {
        console.error('❌ Error al obtener proyectos:', projectsError.message)
    } else {
        console.log(`🚀 Proyectos encontrados: ${projects?.length || 0}`)
        projects?.forEach((project, i) => {
            console.log(`   ${i + 1}. [${project.category}] ${project.title}`)
        })
    }

    console.log('\n✅ Verificación completada')
}

// Ejecutar
checkDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Error:', error)
        process.exit(1)
    })
