export type MarkerType = "all" | "conference" | "office" | "military";
export type Section = "map" | "timeline" | "facts" | "office" | "conferences" | "operations";

export interface Marker {
  id: string;
  type: string;
  name: string;
  city: string;
  year: number;
  coords: { x: number; y: number };
  description: string;
}

export const CONFERENCES: Marker[] = [
  {
    id: "dumbarton",
    type: "conference",
    name: "Думбартон-Окс",
    city: "Вашингтон, США",
    year: 1944,
    coords: { x: 18.5, y: 34 },
    description: "Предварительная конференция по созданию ООН. Участники: США, СССР, Великобритания, Китай. Разработана структура будущей организации.",
  },
  {
    id: "yalta",
    type: "conference",
    name: "Ялтинская конференция",
    city: "Ялта, СССР",
    year: 1945,
    coords: { x: 55.5, y: 29 },
    description: "Рузвельт, Черчилль и Сталин согласовали принципы голосования в Совете Безопасности ООН и созыв конференции в Сан-Франциско.",
  },
  {
    id: "sanfrancisco",
    type: "conference",
    name: "Конференция в Сан-Франциско",
    city: "Сан-Франциско, США",
    year: 1945,
    coords: { x: 11, y: 33.5 },
    description: "Главная учредительная конференция. 50 государств подписали Устав ООН 26 июня 1945 года.",
  },
  {
    id: "tehran",
    type: "conference",
    name: "Тегеранская конференция",
    city: "Тегеран, Иран",
    year: 1943,
    coords: { x: 59.5, y: 31.5 },
    description: "Первая встреча «Большой тройки» — Рузвельт, Черчилль и Сталин. Обсуждалось послевоенное устройство мира и принципы будущей международной организации безопасности.",
  },
];

export const UN_HQ: Marker = {
  id: "unhq",
  type: "office",
  name: "Штаб-квартира ООН",
  city: "Нью-Йорк, США",
  year: 1952,
  coords: { x: 21.5, y: 31.5 },
  description: "Главный офис ООН на берегу Ист-Ривер. Основан в 1952 году. Здесь заседают Генеральная Ассамблея, Совет Безопасности и Экономический Совет.",
};

export const OPERATIONS: Marker[] = [
  {
    id: "yugoslavia",
    type: "military",
    name: "UNPROFOR — Югославия",
    city: "Сараево, Босния",
    year: 1992,
    coords: { x: 51.5, y: 27.5 },
    description: "Силы ООН по охране (UNPROFOR) — первая крупная миротворческая операция в Европе. 1992–1995 гг. Зоны защиты в Хорватии и Боснии.",
  },
  {
    id: "syria",
    type: "military",
    name: "УНСМИС — Сирия",
    city: "Дамаск, Сирия",
    year: 2012,
    coords: { x: 57, y: 33 },
    description: "Миссия ООН по наблюдению в Сирии (УНСМИС, 2012). Наблюдатели развёрнуты для мониторинга прекращения огня в ходе гражданской войны.",
  },
];

export const ALL_MARKERS: Marker[] = [...CONFERENCES, UN_HQ, ...OPERATIONS];

export const TIMELINE_EVENTS = [
  { year: 1941, text: "Атлантическая хартия Рузвельта и Черчилля — первые принципы послевоенного мира" },
  { year: 1942, text: "Декларация Объединённых Наций подписана 26 государствами" },
  { year: 1944, text: "Конференция в Думбартон-Оксе — разработка структуры ООН" },
  { year: 1945, text: "Ялта: согласование принципов голосования в СБ ООН" },
  { year: 1945, text: "Сан-Франциско: подписание Устава ООН (26 июня)" },
  { year: 1945, text: "Устав вступил в силу 24 октября — День ООН" },
  { year: 1943, text: "Тегеран: первая встреча «Большой тройки» — Рузвельт, Черчилль, Сталин" },
  { year: 1952, text: "Штаб-квартира ООН в Нью-Йорке официально открыта" },
  { year: 1992, text: "UNPROFOR: миротворцы ООН в Югославии" },
  { year: 2012, text: "УНСМИС: наблюдательная миссия в Сирии" },
];

export const UN_FACTS = [
  { label: "Государств-членов", value: "193" },
  { label: "Сотрудников по всему миру", value: "44 000+" },
  { label: "Миротворческих операций", value: "71" },
  { label: "Официальных языков", value: "6" },
  { label: "Год основания", value: "1945" },
  { label: "Полевых миссий", value: "12" },
];