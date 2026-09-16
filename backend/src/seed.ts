import { PrismaClient, LeadSource, LeadStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const firstNames = [
  "Иван",
  "Мария",
  "Александр",
  "Екатерина",
  "Дмитрий",
  "Ольга",
  "Сергей",
  "Анна",
  "Алексей",
  "Наталья",
  "Михаил",
  "Татьяна",
  "Андрей",
  "Елена",
  "Николай",
  "Ирина",
  "Владимир",
  "Светлана",
  "Павел",
  "Юлия",
  "Роман",
  "Ксения",
  "Артём",
  "Дарья",
  "Максим",
  "Виктория",
  "Денис",
  "Марина",
  "Игорь",
  "Оксана",
];

const lastNames = [
  "Петров",
  "Сидорова",
  "Кузнецов",
  "Волкова",
  "Соколов",
  "Морозова",
  "Новиков",
  "Иванова",
  "Смирнов",
  "Козлова",
  "Лебедев",
  "Егорова",
  "Орлов",
  "Фёдорова",
  "Зайцев",
  "Крылова",
  "Никитин",
  "Белова",
  "Гусев",
  "Титова",
  "Комаров",
  "Медведева",
  "Киселёв",
  "Романова",
  "Сорокин",
  "Попова",
  "Макаров",
  "Виноградова",
];

const companies = [
  "ООО «ТехноСофт»",
  "АО «МедПром»",
  "ООО «СтройИнвест»",
  "ПАО «ЭнергоСеть»",
  "ООО «ФинТек»",
  "ООО «ДатаЛаб»",
  "АО «РосМед»",
  "ООО «Логистик Плюс»",
  "ООО «Реал Эстейт»",
  "АО «АгроХолдинг»",
  "ООО «Ритейл Групп»",
  "ООО «Образование+»",
  "ООО «ТрансЛогистик»",
  "АО «ГазРесурс»",
  "ООО «АйТи Решения»",
  "ИП Смирнов А.В.",
];

const positions = [
  "CTO",
  "IT-директор",
  "Руководитель отдела",
  "Менеджер проектов",
  "Технический директор",
  "Начальник производства",
  "Директор по развитию",
  "Коммерческий директор",
  "Руководитель IT",
  "Главный инженер",
];

const cities = [
  "Москва",
  "Санкт-Петербург",
  "Екатеринбург",
  "Новосибирск",
  "Казань",
  "Нижний Новгород",
  "Челябинск",
  "Самара",
  "Омск",
  "Ростов-на-Дону",
  "Уфа",
  "Красноярск",
  "Воронеж",
  "Пермь",
  "Волгоград",
];

const industries = [
  "IT",
  "Медицина",
  "Строительство",
  "Энергетика",
  "Финансы",
  "Образование",
  "Производство",
  "Логистика",
  "Ритейл",
];

const managers = [
  "Алексей Сысоев",
  "Мария Иванова",
  "Дмитрий Козлов",
  "Ольга Смирнова",
];

const sources: LeadSource[] = [
  "website",
  "referral",
  "cold_call",
  "email",
  "social",
  "event",
  "partner",
];

const statuses: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
];

const notes = [
  "Интересуются интеграцией с 1С",
  "Нужна консультация по срокам",
  "Запросили коммерческое предложение",
  "Готовы к встрече на следующей неделе",
  "Обсуждают бюджет",
  "Сравнивают с конкурентами",
  "Хотят пилотный проект",
  null,
];

const domains = ["mail.ru", "yandex.ru", "gmail.com", "company.ru"];

const translitMap: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (daysAgo: number) =>
  new Date(Date.now() - randomInt(0, daysAgo) * 24 * 60 * 60 * 1000);

const translit = (str: string): string =>
  str
    .toLowerCase()
    .split("")
    .map((ch) => translitMap[ch] ?? ch)
    .join("");

async function main() {
  console.log("Seeding database...");

  const demoPassword = await bcrypt.hash("demo123", 10);
  await prisma.user.upsert({
    where: { email: "demo@skilldev.ru" },
    update: {},
    create: {
      email: "demo@skilldev.ru",
      password: demoPassword,
      name: "Демо-пользователь",
      isDemo: true,
    },
  });
  console.log("Demo user: demo@skilldev.ru / demo123");

  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "Lead" RESTART IDENTITY CASCADE;',
  );
  console.log("Cleared existing leads");

  const leads = [];
  const usedEmails = new Set<string>();

  for (let i = 0; i < 140; i++) {
    const firstName = pick(firstNames);
    const lastName = pick(lastNames);
    const firstLat = translit(firstName);
    const lastLat = translit(lastName);

    let email = `${firstLat[0]}.${lastLat}@${pick(domains)}`;
    let counter = 1;
    while (usedEmails.has(email)) {
      email = `${firstLat[0]}.${lastLat}${counter}@${pick(domains)}`;
      counter++;
    }
    usedEmails.add(email);

    const status = pick(statuses);
    const isClosed = status === "won" || status === "lost";
    const createdAt = randomDate(365);

    leads.push({
      firstName,
      lastName,
      email,
      phone: `+7 (${randomInt(900, 999)}) ${randomInt(100, 999)}-${randomInt(10, 99)}-${randomInt(10, 99)}`,
      company: pick(companies),
      position: pick(positions),
      source: pick(sources),
      status,
      manager: pick(managers),
      dealAmount:
        status === "won"
          ? randomInt(100, 5000) * 1000
          : randomInt(0, 2000) * 1000,
      city: pick(cities),
      industry: pick(industries),
      notes: pick(notes),
      createdAt,
      closedAt: isClosed
        ? new Date(createdAt.getTime() + randomInt(7, 90) * 24 * 60 * 60 * 1000)
        : null,
    });
  }

  await prisma.lead.createMany({ data: leads });
  console.log(`Created ${leads.length} leads`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
