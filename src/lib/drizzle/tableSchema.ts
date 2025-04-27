import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const userRoles = ['admin', 'user'] as const;
export type UserRole = (typeof userRoles)[number];
export const userRoleEnum = pgEnum('user_role', userRoles);

// Define tables first
export const userTable = pgTable('users', {
    id: uuid().primaryKey().defaultRandom(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    salt: text('salt').notNull(),
    role: userRoleEnum().notNull().default('user'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date())
});

export const postTable = pgTable('posts', {
    id: uuid().primaryKey().defaultRandom(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    userId: uuid().references(() => userTable.id), // Add reference to user
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date())
});

// Define relations after all tables exist
export const userTableRelations = relations(userTable, ({ many }) => ({
    posts: many(postTable)
}));

export const postTableRelations = relations(postTable, ({ one }) => ({
    user: one(userTable, {
        fields: [postTable.userId],
        references: [userTable.id]
    })
}));
