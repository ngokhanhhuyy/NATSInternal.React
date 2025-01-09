export function useAvatarUtility() {
    return {
        getDefaultAvatarUrlByFullName(fullName: string): string {
            return "https://ui-avatars.com/api/?name=" +
                    `${fullName.replace(" ", "+")}&background=random&size=256`;
        }
    };
}