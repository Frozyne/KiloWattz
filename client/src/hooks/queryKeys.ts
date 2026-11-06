export const queryKeys = {
    household: {
        all: ['household'] as const,
        detail: (id: string) => ['household', id] as const,
    },
    infrastructure: {
        all: ['infrastructure'] as const,
        detail: (type: string) => ['infrastructure', type] as const,
    },
}