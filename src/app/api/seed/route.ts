/**
 * GET /api/seed
 * One-time setup: inserts the admin user + 5 seed posts into Supabase.
 * Safe to call multiple times — skips rows that already exist.
 * DELETE or secure this route after the first run.
 */

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { adminDb } from '@/lib/supabase-admin'

const ADMIN_ID = 'admin-001'

const seedPosts = [
  {
    id: 'post-001',
    title: 'President Ray Launches Mombasa Youth Innovation Festival 2026',
    slug: 'president-ray-launches-innovation-festival-2026',
    excerpt: 'His Excellency Antigoals Ray officially launches the Mombasa Youth Innovation Festival 2026, calling on young innovators to bring their ideas to the forefront of community development.',
    content: `His Excellency Antigoals Ray, President of the Mombasa Youth Council, today officially launched the highly anticipated Mombasa Youth Innovation Festival 2026, a flagship event that will bring together young innovators, entrepreneurs, and change-makers from across Mombasa County.\n\nSpeaking at the launch ceremony, President Ray emphasized the importance of youth-led innovation in driving sustainable development and economic growth in the region.\n\n"The Innovation Festival is more than just an event — it is a declaration that the youth of Mombasa are ready, capable, and determined to shape the future of this county," President Ray said.\n\nThe festival will feature innovation showcases, pitch competitions, mentorship sessions, and partnerships with leading organizations committed to youth empowerment.`,
    category: 'News',
    author_id: ADMIN_ID,
    author_name: 'MYC Communications',
    published: true,
    created_at: '2026-06-10T09:00:00Z',
    updated_at: '2026-06-10T09:00:00Z',
  },
  {
    id: 'post-002',
    title: '#SheriaYaVijana: Youth Rally for Policy Inclusion in Mombasa',
    slug: 'sheria-ya-vijana-youth-rally-policy-inclusion',
    excerpt: 'Hundreds of young people from across Mombasa County converged for the #SheriaYaVijana rally, demanding greater youth participation in policy-making and governance processes.',
    content: `Hundreds of young people from across Mombasa County converged in a powerful display of civic engagement at the #SheriaYaVijana rally, organized by the Mombasa Youth Council.\n\n"#SheriaYaVijana is about ensuring that the youth of Mombasa understand, engage with, and influence the laws that affect them," Deputy President Khadija Jilo said in her address.\n\nThe event featured policy forums, legal awareness sessions, and presentations by youth advocates on issues ranging from youth unemployment and entrepreneurship to climate action and social inclusion.`,
    category: 'Advocacy',
    author_id: ADMIN_ID,
    author_name: 'MYC Communications',
    published: true,
    created_at: '2026-06-08T10:30:00Z',
    updated_at: '2026-06-08T10:30:00Z',
  },
  {
    id: 'post-003',
    title: 'MYC Partners with Kenya Red Cross for Youth Leadership Training',
    slug: 'myc-kenya-red-cross-leadership-training',
    excerpt: 'The Mombasa Youth Council has formalized a partnership with the Kenya Red Cross Society to equip young people with grassroots leadership and community service skills.',
    content: `The Mombasa Youth Council has formalized a strategic partnership with the Kenya Red Cross Society aimed at equipping young people with the skills, values, and tools needed to become effective grassroots leaders in their communities.\n\n"Leadership is not a title — it is a service," President Ray said. "Through this partnership with the Kenya Red Cross, we are investing in the next generation of community leaders who will drive change at the grassroots level."\n\nApplications for the first cohort of the leadership training programme will open in the coming weeks.`,
    category: 'Programmes',
    author_id: ADMIN_ID,
    author_name: 'MYC Communications',
    published: true,
    created_at: '2026-06-05T08:00:00Z',
    updated_at: '2026-06-05T08:00:00Z',
  },
  {
    id: 'post-004',
    title: 'Governance Structure of the Mombasa Youth Council Formalized',
    slug: 'myc-governance-structure-formalized',
    excerpt: 'The Mombasa Youth Council officially adopts its governance framework, establishing the Administration, Youth Assembly, and standing Committees to guide the Council\'s operations.',
    content: `The Mombasa Youth Council has officially adopted a comprehensive governance framework that will guide its operations, ensure accountability, and promote effective leadership across Mombasa County.\n\nThe governance structure establishes three distinct but complementary organs: the Administration, the Youth Assembly, and standing Committees.\n\n"This governance structure ensures that no single individual or group can dominate the Council," Secretary General noted. "It is designed to be inclusive, accountable, and representative of all youth in Mombasa County."`,
    category: 'Governance',
    author_id: ADMIN_ID,
    author_name: 'MYC Communications',
    published: true,
    created_at: '2026-06-01T14:00:00Z',
    updated_at: '2026-06-01T14:00:00Z',
  },
  {
    id: 'post-005',
    title: 'Deputy President Khadija Jilo Champions Gender Equality at Youth Forum',
    slug: 'dp-khadija-jilo-gender-equality-youth-forum',
    excerpt: 'Deputy President Khadija Jilo delivers a powerful address on gender equality and inclusive leadership at the Mombasa County Youth Forum.',
    content: `Deputy President Khadija Jilo delivered a compelling address on gender equality and inclusive leadership at the Mombasa County Youth Forum, reinforcing the Mombasa Youth Council's commitment to ensuring that women and girls have an equal voice in all spheres of youth governance.\n\n"Gender equality is not a women's issue — it is a human issue and a development imperative," Deputy President Jilo said.\n\nShe announced plans to establish a Women in Leadership initiative under the MYC umbrella, aimed at mentoring and supporting young women who aspire to leadership positions.`,
    category: 'Leadership',
    author_id: ADMIN_ID,
    author_name: 'MYC Communications',
    published: true,
    created_at: '2026-05-28T11:00:00Z',
    updated_at: '2026-05-28T11:00:00Z',
  },
]

export async function GET() {
  try {
    // 1. Seed admin user (skip if exists)
    const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin@MYC2026!'
    const passwordHash = await bcrypt.hash(adminPassword, 12)

    const { error: userErr } = await adminDb.from('users').upsert(
      {
        id: ADMIN_ID,
        name: 'MYC Admin',
        email: 'admin@myc.co.ke',
        password: passwordHash,
        role: 'admin',
        created_at: '2026-01-01T00:00:00Z',
      },
      { onConflict: 'id', ignoreDuplicates: true },
    )
    if (userErr) console.warn('admin upsert:', userErr.message)

    // 2. Seed posts (skip any that already exist)
    const { error: postsErr } = await adminDb
      .from('posts')
      .upsert(seedPosts, { onConflict: 'id', ignoreDuplicates: true })
    if (postsErr) console.warn('posts upsert:', postsErr.message)

    return NextResponse.json({
      ok: true,
      message: 'Database seeded. You can now delete /api/seed from the codebase.',
    })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
