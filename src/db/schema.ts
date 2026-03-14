import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  vector,
} from "drizzle-orm/pg-core";
import { user } from "../../auth-schema";

export const dataKeys = pgTable("data_keys", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => user.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  group: text("group"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const activityDefinitions = pgTable("activity_definitions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => user.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  group: text("group"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const person = pgTable(
  "person",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => user.id, {
      onDelete: "cascade",
    }),
    name: text("name").notNull(),
    primaryEmail: text("primary_email").unique(),
    primaryPhone: text("primary_phone"),
    bio: text("bio"),
    data: jsonb("data").default(sql`'{}'::jsonb`),
    bioEmbedding: vector("bio_embedding", { dimensions: 1536 }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index().using("hnsw", table.bioEmbedding.op("vector_cosine_ops")),
    index("idx_person_name").on(table.name),
    index("idx_person_data").using("gin", table.data),
  ],
);

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id").references(() => user.id, {
      onDelete: "cascade",
    }),
    name: text("name").notNull(),
    subtitle: text("subtitle"),
    group: text("group"),
    content: text("content"),
    tags: text("tags").array(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_reports_group").on(table.group),
    index("idx_reports_tags").using("gin", table.tags),
  ],
);

export const activities = pgTable(
  "activities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    personId: uuid("person_id").references(() => person.id, {
      onDelete: "cascade",
    }),
    definitionId: uuid("definition_id").references(
      () => activityDefinitions.id,
    ),
    activityDate: timestamp("activity_date", {
      withTimezone: true,
    }).defaultNow(),
    notes: text("notes"),
    metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index("idx_activities_person_id").on(table.personId),
    index("idx_activities_date").on(table.activityDate),
  ],
);

export const reportEmbeddings = pgTable(
  "report_embeddings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reportId: uuid("report_id").references(() => reports.id, {
      onDelete: "cascade",
    }),
    chunkIndex: integer("chunk_index").notNull(),
    contentChunk: text("content_chunk").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => [
    index().using("hnsw", table.embedding.op("vector_cosine_ops")),
    index("idx_report_embeddings_report_id").on(table.reportId),
  ],
);

export const reportPeople = pgTable(
  "report_people",
  {
    reportId: uuid("report_id").references(() => reports.id, {
      onDelete: "cascade",
    }),
    personId: uuid("person_id").references(() => person.id, {
      onDelete: "cascade",
    }),
  },
  (table) => [
    primaryKey({ columns: [table.reportId, table.personId] }),
    index("idx_report_people_person").on(table.personId),
  ],
);

export const reportLinks = pgTable(
  "report_links",
  {
    parentReportId: uuid("parent_report_id").references(() => reports.id, {
      onDelete: "cascade",
    }),
    childReportId: uuid("child_report_id").references(() => reports.id, {
      onDelete: "cascade",
    }),
  },
  (table) => [
    primaryKey({ columns: [table.parentReportId, table.childReportId] }),
    check(
      "no_self_link",
      sql`${table.parentReportId} != ${table.childReportId}`,
    ),
    index("idx_report_links_child").on(table.childReportId),
  ],
);

export const activityReports = pgTable(
  "activity_reports",
  {
    activityId: uuid("activity_id").references(() => activities.id, {
      onDelete: "cascade",
    }),
    reportId: uuid("report_id").references(() => reports.id, {
      onDelete: "cascade",
    }),
  },
  (table) => [
    primaryKey({ columns: [table.activityId, table.reportId] }),
    index("idx_activity_reports_report").on(table.reportId),
  ],
);
