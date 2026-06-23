export type SchoolId = 'shared' | 'boys' | 'girls';

export type ContentSection = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  paragraphs: readonly string[];
  highlights?: readonly string[];
  sourceUrl: string;
};

export type SiteContentManifest = {
  capturedAt: string;
  editorialPolicy: string;
  corrections: readonly string[];
  schools: Record<SchoolId, {
    name: string;
    shortName: string;
    description: string;
    contact: { address: string; phones: readonly string[]; emails: readonly string[] };
    sections: readonly ContentSection[];
  }>;
};

const sharedSource = 'https://lamartiniere.co/';
const boysSource = 'https://lamartiniere.co/laMartiniereForBoys/';
const girlsSource = 'https://lamartiniere.co/laMartiniereForGirls/';

export const SITE_CONTENT: SiteContentManifest = {
  capturedAt: '2026-06-21',
  editorialPolicy: 'Official public content is locally curated, lightly corrected for spelling and layout, and always linked to its source.',
  corrections: [
    'Standardized the motto spelling to “Labore et Constantia”.',
    'Omitted the Boys acting-principal biography accidentally displayed on the Girls About page.',
    'Normalized punctuation, spacing and school-name capitalization without changing institutional facts.',
    'Sports facilities without published plans are identified as a reference-led virtual recreation.',
  ],
  schools: {
    shared: {
      name: 'La Martiniere Kolkata', shortName: 'La Martiniere',
      description: 'A shared heritage institution founded in 1836 and guided by Labore et Constantia.',
      contact: {
        address: '11, Dr. U. N. Brahmachari Street, Kolkata 700017',
        phones: ['033 4040 6601 — General enquiry', '033 4040 6607 — School fee'],
        emails: ['secretary@lamartiniere.co', 'lmcao@lamartiniere.co'],
      },
      sections: [
        {
          slug: 'about', title: 'A Legacy of Excellence', eyebrow: 'Established 1836',
          summary: 'Nearly two centuries of education rooted in individual growth, academic excellence and alumni success.',
          paragraphs: [
            'La Martiniere School was established in 1836 through the vision and endowment of Major General Claude Martin. The Kolkata schools educate pupils from Lower Nursery to Class XII and are affiliated to the Council for the Indian School Examinations, New Delhi.',
            'The school continues to pursue excellence through its motto, Labore et Constantia—by labour and consistent effort—while nurturing independent thought, leadership, creativity and service.',
          ], highlights: ['Individual Growth', 'Academic Excellence', 'Alumni Success'], sourceUrl: sharedSource,
        },
        {
          slug: 'founder', title: 'Claude Martin’s Legacy', eyebrow: 'Founder · Visionary · Benefactor',
          summary: 'His endowments established La Martiniere schools in Kolkata, Lucknow and Lyon.',
          paragraphs: [
            'Claude Martin came to India in 1752 and rose from a private soldier to Major General. At his death in September 1800, his will left generous endowments for schools serving the public good.',
            'After litigation surrounding the will was resolved, La Martiniere Schools opened in Kolkata on 1 March 1836. His founding vision continues through holistic education, creative thought and service to the community.',
          ], sourceUrl: sharedSource,
        },
        {
          slug: 'benefactor', title: 'Sir Catchick Paul Chater', eyebrow: 'Our Benefactor',
          summary: 'A former Foundationer whose generosity helped preserve the schools during financial crisis.',
          paragraphs: [
            'Sir Catchick Paul Chater studied at La Martiniere from 1856 to 1863, later becoming a respected banker and philanthropist in Hong Kong.',
            'When the Kolkata schools faced closure, he donated six lakh rupees in 1925 and five lakh rupees the following year. His name remains part of the school prayer and annual remembrance.',
          ], sourceUrl: sharedSource,
        },
        {
          slug: 'traditions', title: 'Song, Prayer and Motto', eyebrow: 'Labore et Constantia',
          summary: 'Traditions that connect generations of Martinians.',
          paragraphs: [
            'The school song, Vive La Martiniere, was composed by Frederick James Rowe, an assistant master from 1868 to 1870. It honours the Founder and calls every generation to fidelity, constancy and courage.',
            'The school prayer gives thanks for Claude Martin, Sir Catchick Paul Chater and all who served the institution, while asking that pupils be generous, brave, pure and true in work and play.',
          ], sourceUrl: 'https://lamartiniere.co/laMartiniereForBoys/foundationdetails.html',
        },
        {
          slug: 'admissions', title: 'Admissions 2027–2028', eyebrow: 'Lower Nursery and other classes',
          summary: 'Official entry criteria, document guidance and application links.',
          paragraphs: [
            'For Lower Nursery 2027–2028, the candidate’s date of birth must fall between 1 January and 31 December 2024. The online form requires passport photographs of the candidate, father and mother.',
            'Legal documents are required during interaction for adopted children and single-parent cases. A prescribed medical certificate and self-attested photocopies must be produced with originals during interaction. The online application is stated to be available from 1 June 2026.',
            'For other classes, requests may be emailed to the Secretary with the candidate’s birth certificate, latest report card when available, and brief parent biodata.',
          ], highlights: ['Official notice', 'Lower Nursery application', 'Other-class enquiries'], sourceUrl: sharedSource,
        },
        {
          slug: 'organization', title: 'One Institution, Two Schools', eyebrow: 'Organization',
          summary: 'A shared central administration supports the Boys and Girls schools.',
          paragraphs: [
            'La Martiniere Kolkata brings together La Martiniere for Boys and La Martiniere for Girls under a shared institutional legacy, central administration and admissions framework.',
            'Each school retains its own identity, leadership, educational programme, activities, contact channels and campus experience.',
          ], sourceUrl: sharedSource,
        },
      ],
    },
    boys: {
      name: 'La Martiniere for Boys', shortName: 'Boys',
      description: 'Holistic education, leadership, service and sporting excellence with strong local roots.',
      contact: {
        address: '11, Dr. U. N. Brahmachari Street, Kolkata 700017, West Bengal',
        phones: ['(033) 40406612', '(033) 40406613'], emails: ['secretariat_lmb@lamartiniere.co'],
      },
      sections: [
        {
          slug: 'profile', title: 'Men of Substance', eyebrow: 'School Profile',
          summary: 'An all-round education from Lower Nursery to Class XII with ICSE and ISC pathways.',
          paragraphs: [
            'Established in 1836 by Major General Claude Martin, La Martiniere for Boys serves more than 3,800 pupils and is affiliated with the Council for the Indian School Examinations, New Delhi.',
            'The school blends global education with strong local roots. Academic disciplines, creative pursuits, community service, sport and co-curricular activities share equal importance.',
            'Its programmes nurture academic excellence, independent thinking, diverse talent, leadership and a deep commitment to serving the community.',
          ], sourceUrl: boysSource,
        },
        {
          slug: 'principal', title: 'From the Principal’s Desk', eyebrow: 'Welcome',
          summary: 'Value-based holistic education for responsible and worthy citizens.',
          paragraphs: [
            'The school’s leadership describes La Martiniere as a place where education extends beyond books into community service, creative pursuits, sports and games.',
            'Pupils are prepared to contribute in the wider world while remaining proud of their cultural heritage and committed to equitable, progressive communities.',
          ], sourceUrl: boysSource,
        },
        {
          slug: 'sports', title: 'Games and Sports', eyebrow: 'Train · Compete · Lead',
          summary: 'A broad programme supported by fields, courts, specialist coaching and aquatic training.',
          paragraphs: ['Students are offered opportunities in football, cricket, swimming, basketball, volleyball, lawn tennis, table tennis, rifle shooting, badminton, athletics, chess, golf, rowing and skating.'],
          highlights: ['Football', 'Cricket', 'Swimming', 'Basketball', 'Volleyball', 'Lawn Tennis', 'Athletics', 'Rowing'],
          sourceUrl: 'https://lamartiniere.co/laMartiniereForBoys/games-sports.html',
        },
        {
          slug: 'achievements', title: 'Achievement Gallery', eyebrow: 'Academic · Sporting · Community',
          summary: 'National, regional and city recognition across school and individual categories.',
          paragraphs: [
            'Recent recognition includes the School of Excellence Award 2025 and School of the Year honours, along with leading rankings among boys’ day schools and vintage legacy schools.',
            'Students have received recognition for academic performance, courage, social service, extra-curricular excellence and sporting achievement, including swimming, equestrian sport and squash.',
          ], highlights: ['School of Excellence 2025', 'ICSE toppers', 'Social Service', 'Extra-Curricular Excellence', 'Regional Sports Champions'],
          sourceUrl: 'https://lamartiniere.co/laMartiniereForBoys/school-awards.html',
        },
        {
          slug: 'legacy', title: 'Founder and Foundationers', eyebrow: 'Public Good of Calcutta',
          summary: 'The founding endowment and tradition of supported education remain central to the school.',
          paragraphs: ['Claude Martin’s vision established schools in Kolkata, Lucknow and Lyon. La Martiniere’s Foundationer tradition reflects his commitment to education, compassion and public service.'],
          sourceUrl: 'https://lamartiniere.co/laMartiniereForBoys/foundationdetails.html',
        },
      ],
    },
    girls: {
      name: 'La Martiniere for Girls', shortName: 'Girls',
      description: 'Educating the girl child, building character and preparing global citizens with strong values.',
      contact: {
        address: '14, Rawdon Street, Kolkata 700017',
        phones: ['(033) 22903841', '(033) 40406662'], emails: ['lmgkolkata@gmail.com'],
      },
      sections: [
        {
          slug: 'profile', title: 'Women of Substance', eyebrow: 'School Profile',
          summary: 'Nearly 3,000 pupils from Lower Nursery to Class XII in a values-led, future-ready school.',
          paragraphs: [
            'La Martiniere for Girls was established in 1836 by Major General Claude Martin and is affiliated with the Council for the Indian School Examinations, New Delhi.',
            'The school combines technology-enabled experiential learning with sports, music, theatre, photography, art, technology and community engagement.',
            'Its alumni contribute globally across sport, science and the liberal arts while remaining loyal to their heritage and motto.',
          ], sourceUrl: girlsSource,
        },
        {
          slug: 'mission-vision', title: 'Mission and Vision', eyebrow: 'Head · Heart · Hands',
          summary: 'Educating the girl child and building character for a more equitable society.',
          paragraphs: ['Mission: Educating the Girl Child and building character.', 'Vision: Each student shall contribute to the making of a more equitable and progressive society.'],
          highlights: ['Honesty', 'Compassion', 'Inclusion', 'Gratitude'], sourceUrl: girlsSource,
        },
        {
          slug: 'principal', title: 'From the Principal’s Desk', eyebrow: 'Everything you can imagine is real',
          summary: 'Imagination, values and 21st-century skills prepare pupils for a complex world.',
          paragraphs: [
            'The school develops holistic personality and character through academic and co-curricular learning grounded in honesty, compassion, inclusion and gratitude.',
            'From classroom and laboratory to activity field and playground, progressive methods develop the head, heart and hands of every learner. LED screens support engaging digital learning in classrooms.',
          ], sourceUrl: girlsSource,
        },
        {
          slug: 'activities', title: 'Houses, Clubs and Activities', eyebrow: 'Belong · Create · Compete',
          summary: 'A broad student-life programme spanning leadership, arts, technology and sport.',
          paragraphs: ['The four houses are Macaulay, Charnock, Martin and Hastings. Clubs and activities include debate, heritage, nature, science, quiz, art, robotics, reading, economics, skating, dance, choir, orchestra, Girl Guides, MUN, karate, swimming, basketball and football.'],
          highlights: ['Macaulay', 'Charnock', 'Martin', 'Hastings', 'Robotics', 'Choir', 'Orchestra', 'Swimming', 'Basketball', 'Football'],
          sourceUrl: 'https://lamartiniere.co/laMartiniereForGirls/extracurricular-activities.html',
        },
        {
          slug: 'academics', title: 'Learning Environments', eyebrow: 'Tradition meets technology',
          summary: 'Technology-enabled classrooms and specialist spaces for science, art, music and computing.',
          paragraphs: ['Published school history describes libraries and laboratories for Physics, Chemistry, Biology, Home Science, Art, Music and Computer Science, supported by modern pedagogical practice and digital classroom displays.'],
          highlights: ['LED classrooms', 'Physics', 'Chemistry', 'Biology', 'Home Science', 'Art', 'Music', 'Computer Science'],
          sourceUrl: 'https://lamartiniere.co/laMartiniereForGirls/school-history.html',
        },
        {
          slug: 'legacy', title: 'A Separate School Since 1840', eyebrow: 'Claude Martin’s Endowment',
          summary: 'The Girls school grew from the original 1836 institution into a distinct identity.',
          paragraphs: ['The Kolkata school opened on 1 March 1836. La Martiniere for Girls became a separate entity in 1840 while continuing the Founder’s provision for Foundationers and commitment to public good.'],
          sourceUrl: 'https://lamartiniere.co/laMartiniereForGirls/foundationdetails.html',
        },
      ],
    },
  },
};

export function getSchoolContent(id: SchoolId) {
  return SITE_CONTENT.schools[id];
}

export function getSection(id: SchoolId, slug: string) {
  return SITE_CONTENT.schools[id].sections.find((section) => section.slug === slug);
}
