const avatarUtility = {
    getDefaultAvatarUrlByFullName(fullName: string): string {
        const computedFullName = fullName.replace(" ", "+");
        return `https://ui-avatars.com/api/?name=${computedFullName}&background=random`;
    }
};

export function useAvatarUtility() {
    return avatarUtility;
}