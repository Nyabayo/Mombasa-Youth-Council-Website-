import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import type { User, Post, Comment } from './types'

const ADMIN_ID = 'admin-001'
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD ?? 'Admin@MYC2026!', 12)

const seedPosts: Post[] = [
  {
    id: 'post-001',
    title: 'President Ray Launches Mombasa Youth Innovation Festival 2026',
    slug: 'president-ray-launches-innovation-festival-2026',
    excerpt:
      'His Excellency Antigoals Ray officially launches the Mombasa Youth Innovation Festival 2026, calling on young innovators to bring their ideas to the forefront of community development.',
    content: `His Excellency Antigoals Ray, President of the Mombasa Youth Council, today officially launched the highly anticipated Mombasa Youth Innovation Festival 2026, a flagship event that will bring together young innovators, entrepreneurs, and change-makers from across Mombasa County.

Speaking at the launch ceremony, President Ray emphasized the importance of youth-led innovation in driving sustainable development and economic growth in the region.

"The Innovation Festival is more than just an event — it is a declaration that the youth of Mombasa are ready, capable, and determined to shape the future of this county," President Ray said. "We want to see ideas become businesses, innovations become solutions, and dreams become reality."

The festival, scheduled to take place later this year, will feature innovation showcases, pitch competitions, mentorship sessions, networking opportunities, and partnerships with leading organizations committed to youth empowerment.

Strategic workplans that turn youth-led ideas in entrepreneurship, creative industries, and social impact into tangible action will be developed during the festival. Young people are encouraged to register their projects and innovations ahead of the event.

The Mombasa Youth Council continues to position itself as a credible platform for youth engagement, advocacy, and development across all sub-counties of Mombasa.`,
    category: 'News',
    authorId: ADMIN_ID,
    authorName: 'MYC Communications',
    published: true,
    createdAt: new Date('2026-06-10T09:00:00').toISOString(),
    updatedAt: new Date('2026-06-10T09:00:00').toISOString(),
  },
  {
    id: 'post-002',
    title: '#SheriaYaVijana: Youth Rally for Policy Inclusion in Mombasa',
    slug: 'sheria-ya-vijana-youth-rally-policy-inclusion',
    excerpt:
      'Hundreds of young people from across Mombasa County converged for the #SheriaYaVijana rally, demanding greater youth participation in policy-making and governance processes.',
    content: `Hundreds of young people from across Mombasa County converged in a powerful display of civic engagement at the #SheriaYaVijana rally, organized by the Mombasa Youth Council under the leadership of President Antigoals Ray and Deputy President Khadija Jilo.

The rally, which brought together youth from all six sub-counties of Mombasa, was a declaration that young people are not passive recipients of governance — they are active participants in shaping the laws and policies that govern their lives.

"#SheriaYaVijana is about ensuring that the youth of Mombasa understand, engage with, and influence the laws that affect them," Deputy President Khadija Jilo said in her address. "We are not asking for a seat at the table — we are building our own table."

The event featured policy forums, legal awareness sessions, and presentations by youth advocates on issues ranging from youth unemployment and entrepreneurship to climate action and social inclusion.

Support from allied leaders and community organizations reinforced the council's legitimacy, pushing back against efforts to sideline youth participation in governance.

The Mombasa Youth Council called on the county government and national government institutions to formalize channels for youth input in policy development and to allocate resources specifically for youth-led advocacy initiatives.`,
    category: 'Advocacy',
    authorId: ADMIN_ID,
    authorName: 'MYC Communications',
    published: true,
    createdAt: new Date('2026-06-08T10:30:00').toISOString(),
    updatedAt: new Date('2026-06-08T10:30:00').toISOString(),
  },
  {
    id: 'post-003',
    title: 'MYC Partners with Kenya Red Cross for Youth Leadership Training',
    slug: 'myc-kenya-red-cross-leadership-training',
    excerpt:
      'The Mombasa Youth Council has formalized a partnership with the Kenya Red Cross Society to equip young people with grassroots leadership and community service skills.',
    content: `The Mombasa Youth Council has formalized a strategic partnership with the Kenya Red Cross Society aimed at equipping young people with the skills, values, and tools needed to become effective grassroots leaders and change-makers in their communities.

The partnership was announced by President Antigoals Ray during a meeting with Kenya Red Cross leadership in Mombasa, with both parties committing to a structured programme of leadership training, community volunteerism, and capacity building for young people aged 18 to 34.

"Leadership is not a title — it is a service," President Ray said. "Through this partnership with the Kenya Red Cross, we are investing in the next generation of community leaders who will drive change at the grassroots level."

The training programme will cover disaster response and management, community health advocacy, leadership and organizational skills, conflict resolution, and social cohesion. Participants will also engage in practical community projects that directly benefit residents of Mombasa County.

The Kenya Red Cross Society expressed confidence in the partnership, noting the Mombasa Youth Council's commitment to non-partisan, community-centered youth development.

Applications for the first cohort of the leadership training programme will open in the coming weeks. Young people from all sub-counties of Mombasa are encouraged to apply.`,
    category: 'Programmes',
    authorId: ADMIN_ID,
    authorName: 'MYC Communications',
    published: true,
    createdAt: new Date('2026-06-05T08:00:00').toISOString(),
    updatedAt: new Date('2026-06-05T08:00:00').toISOString(),
  },
  {
    id: 'post-004',
    title: 'Governance Structure of the Mombasa Youth Council Formalized',
    slug: 'myc-governance-structure-formalized',
    excerpt:
      'The Mombasa Youth Council officially adopts its governance framework, establishing the Administration, Youth Assembly, and standing Committees to guide the Council\'s operations.',
    content: `The Mombasa Youth Council has officially adopted a comprehensive governance framework that will guide its operations, ensure accountability, and promote effective leadership and representation across Mombasa County.

The governance structure establishes three distinct but complementary organs: the Administration, the Youth Assembly, and standing Committees.

The Administration, led by President Antigoals Ray, serves as the executive arm responsible for the day-to-day management and implementation of programmes. It comprises the President, Deputy President, Executive Committee, Secretary General, Treasurer, Cabinet Secretaries, and other officers.

The Youth Assembly serves as the representative and oversight organ, responsible for representing member interests, debating and adopting policies, exercising oversight over the Administration, and promoting transparency and accountability. The Youth Assembly operates independently and shall not be subject to interference by the Administration.

Standing committees have been established to support the work of both organs, including the Finance and Budget Committee, Vetting and House Business Committee, Governance and Constitutional Affairs Committee, Youth Empowerment and Innovation Committee, Disciplinary Committee, and Events and Programs Committee.

"This governance structure ensures that no single individual or group can dominate the Council," Secretary General noted. "It is designed to be inclusive, accountable, and representative of all youth in Mombasa County."

The adoption of this framework marks a significant milestone in the institutionalization of the Mombasa Youth Council as a credible and structured youth organization.`,
    category: 'Governance',
    authorId: ADMIN_ID,
    authorName: 'MYC Communications',
    published: true,
    createdAt: new Date('2026-06-01T14:00:00').toISOString(),
    updatedAt: new Date('2026-06-01T14:00:00').toISOString(),
  },
  {
    id: 'post-005',
    title: 'Deputy President Khadija Jilo Champions Gender Equality at Youth Forum',
    slug: 'dp-khadija-jilo-gender-equality-youth-forum',
    excerpt:
      'Deputy President Khadija Jilo delivers a powerful address on gender equality and inclusive leadership at the Mombasa County Youth Forum, calling for equal representation in all decision-making bodies.',
    content: `Deputy President Khadija Jilo delivered a compelling address on gender equality and inclusive leadership at the Mombasa County Youth Forum, reinforcing the Mombasa Youth Council's commitment to ensuring that women and girls have an equal voice and equal opportunities in all spheres of youth governance and community life.

Speaking before hundreds of youth delegates, DP Jilo called on organizations, institutions, and communities to move beyond rhetoric and take concrete action to dismantle barriers that prevent women and girls from fully participating in leadership and decision-making.

"Gender equality is not a women's issue — it is a human issue and a development imperative," Deputy President Jilo said. "A council, a community, or a country that sidelines half of its population cannot achieve its full potential."

She highlighted the Mombasa Youth Council's deliberate efforts to ensure gender balance in its governance structures, including reserved positions for women in the Executive Committee and Youth Assembly, and dedicated programmes to support women's leadership development.

The Deputy President also announced plans to establish a Women in Leadership initiative under the MYC umbrella, aimed at mentoring and supporting young women who aspire to leadership positions in their communities, organizations, and government.

Her address was met with a standing ovation, with delegates pledging to champion gender equality in their respective sub-counties and organizations.`,
    category: 'Leadership',
    authorId: ADMIN_ID,
    authorName: 'MYC Communications',
    published: true,
    createdAt: new Date('2026-05-28T11:00:00').toISOString(),
    updatedAt: new Date('2026-05-28T11:00:00').toISOString(),
  },
]

class InMemoryStore {
  users: User[] = [
    {
      id: ADMIN_ID,
      name: 'MYC Admin',
      email: 'admin@myc.co.ke',
      password: ADMIN_PASSWORD_HASH,
      role: 'admin',
      createdAt: new Date('2026-01-01').toISOString(),
    },
  ]
  posts: Post[] = seedPosts
  comments: Comment[] = [
    {
      id: 'comment-001',
      postId: 'post-001',
      authorId: ADMIN_ID,
      authorName: 'MYC Admin',
      content: 'Congratulations to the President on this important initiative. The Innovation Festival will be a game-changer for youth in Mombasa!',
      createdAt: new Date('2026-06-10T10:00:00').toISOString(),
    },
    {
      id: 'comment-002',
      postId: 'post-002',
      authorId: ADMIN_ID,
      authorName: 'MYC Admin',
      content: '#SheriaYaVijana is an important movement. Youth must be at the center of policy-making in our county.',
      createdAt: new Date('2026-06-08T12:00:00').toISOString(),
    },
  ]

  findUserByEmail(email: string) {
    return this.users.find((u) => u.email === email) ?? null
  }

  findUserById(id: string) {
    return this.users.find((u) => u.id === id) ?? null
  }

  addUser(user: User) {
    this.users.push(user)
    return user
  }

  getPublishedPosts() {
    return this.posts
      .filter((p) => p.published)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  getAllPosts() {
    return [...this.posts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }

  findPostBySlug(slug: string) {
    return this.posts.find((p) => p.slug === slug) ?? null
  }

  findPostById(id: string) {
    return this.posts.find((p) => p.id === id) ?? null
  }

  addPost(post: Post) {
    this.posts.push(post)
    return post
  }

  updatePost(id: string, data: Partial<Post>) {
    const idx = this.posts.findIndex((p) => p.id === id)
    if (idx === -1) return null
    this.posts[idx] = { ...this.posts[idx], ...data, updatedAt: new Date().toISOString() }
    return this.posts[idx]
  }

  deletePost(id: string) {
    const idx = this.posts.findIndex((p) => p.id === id)
    if (idx === -1) return false
    this.posts.splice(idx, 1)
    this.comments = this.comments.filter((c) => c.postId !== id)
    return true
  }

  getCommentsByPost(postId: string) {
    return this.comments
      .filter((c) => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }

  addComment(comment: Comment) {
    this.comments.push(comment)
    return comment
  }

  deleteComment(id: string) {
    const idx = this.comments.findIndex((c) => c.id === id)
    if (idx === -1) return false
    this.comments.splice(idx, 1)
    return true
  }

  findCommentById(id: string) {
    return this.comments.find((c) => c.id === id) ?? null
  }

  slugExists(slug: string) {
    return this.posts.some((p) => p.slug === slug)
  }
}

// Module-level singleton — persists across requests in the same server process
const globalStore = globalThis as typeof globalThis & { __mycStore?: InMemoryStore }
if (!globalStore.__mycStore) {
  globalStore.__mycStore = new InMemoryStore()
}

export const store = globalStore.__mycStore
