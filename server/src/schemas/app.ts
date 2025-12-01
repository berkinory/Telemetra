import { t } from 'elysia';

export const CreateAppRequestSchema = t.Object({
  name: t.String({
    minLength: 3,
    maxLength: 14,
    pattern: '^[a-zA-Z0-9\\s-]+$',
    error:
      'App name must be 3-14 characters and contain only letters, numbers, spaces, and hyphens',
  }),
  image: t.Optional(t.String({ format: 'uri' })),
});

export const AppListItemSchema = t.Object({
  id: t.String(),
  name: t.String({ minLength: 1, maxLength: 255 }),
  role: t.Union([t.Literal('owner'), t.Literal('member')]),
});

export const AppKeysResponseSchema = t.Object({
  key: t.String(),
  keyRotatedAt: t.Union([t.String({ format: 'date-time' }), t.Null()]),
});

export const AppTeamMemberSchema = t.Object({
  userId: t.String(),
  email: t.String({ format: 'email' }),
  name: t.Union([t.String(), t.Null()]),
});

export const AppTeamResponseSchema = t.Object({
  owner: t.Object({
    userId: t.String(),
    email: t.String({ format: 'email' }),
    name: t.Union([t.String(), t.Null()]),
  }),
  members: t.Array(AppTeamMemberSchema),
});

export const AppCreatedSchema = t.Object({
  id: t.String(),
  name: t.String({ minLength: 1, maxLength: 255 }),
  image: t.Union([t.String({ format: 'uri' }), t.Null()]),
  createdAt: t.String({ format: 'date-time' }),
});

export const AppsListResponseSchema = t.Object({
  apps: t.Array(AppListItemSchema),
});

export const UpdateAppRequestSchema = t.Object({
  name: t.String({
    minLength: 3,
    maxLength: 14,
    pattern: '^[a-zA-Z0-9\\s-]+$',
  }),
});

export const AddTeamMemberRequestSchema = t.Object({
  email: t.String({ format: 'email' }),
});

export const AddTeamMemberResponseSchema = t.Object({
  userId: t.String(),
  email: t.String({ format: 'email' }),
});

export const AppDetailResponseSchema = t.Object({
  id: t.String(),
  name: t.String({ minLength: 1, maxLength: 255 }),
  image: t.Union([t.String({ format: 'uri' }), t.Null()]),
  createdAt: t.String({ format: 'date-time' }),
  role: t.Union([t.Literal('owner'), t.Literal('member')]),
});

export type CreateAppRequest = typeof CreateAppRequestSchema.static;
export type UpdateAppRequest = typeof UpdateAppRequestSchema.static;
export type AddTeamMemberRequest = typeof AddTeamMemberRequestSchema.static;
export type AddTeamMemberResponse = typeof AddTeamMemberResponseSchema.static;
export type AppListItem = typeof AppListItemSchema.static;
export type AppCreated = typeof AppCreatedSchema.static;
export type AppsListResponse = typeof AppsListResponseSchema.static;
export type AppDetailResponse = typeof AppDetailResponseSchema.static;
export type AppKeysResponse = typeof AppKeysResponseSchema.static;
export type AppTeamMember = typeof AppTeamMemberSchema.static;
export type AppTeamResponse = typeof AppTeamResponseSchema.static;
