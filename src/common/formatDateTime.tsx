export const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
        window.location.href = '/error404'; 
        return ''; 
    }

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
};
