/** Etiquetas Swagger agrupadas por dominio y rol. */
export const SWAGGER_TAGS = {
  AUTH: 'Autenticación',
  USUARIOS_CONFIGURADOR: 'Usuarios · Configurador',
  USUARIOS_ADMIN_CUENTA: 'Usuarios · Admin cuenta',
  SISTEMA: 'Sistema',
} as const;

export type SwaggerTag = (typeof SWAGGER_TAGS)[keyof typeof SWAGGER_TAGS];

export const SWAGGER_TAG_ORDER: readonly SwaggerTag[] = [
  SWAGGER_TAGS.AUTH,
  SWAGGER_TAGS.USUARIOS_CONFIGURADOR,
  SWAGGER_TAGS.USUARIOS_ADMIN_CUENTA,
  SWAGGER_TAGS.SISTEMA,
];

export const SWAGGER_TAG_DESCRIPTIONS: Record<SwaggerTag, string> = {
  [SWAGGER_TAGS.AUTH]:
    'Login, prelogin, perfil y handoff SSO con Mateo. Endpoints públicos y autenticados.',
  [SWAGGER_TAGS.USUARIOS_CONFIGURADOR]:
    'Alta de usuarios en cualquier tenant. Rol requerido: configurador (scope plataforma).',
  [SWAGGER_TAGS.USUARIOS_ADMIN_CUENTA]:
    'Alta de usuarios dentro del tenant activo. Rol requerido: administrador_cuenta (scope cuenta).',
  [SWAGGER_TAGS.SISTEMA]: 'Health check y utilidades de la API.',
};
