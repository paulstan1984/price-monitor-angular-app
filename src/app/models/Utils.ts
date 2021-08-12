
export function getEndOfMonth(date: string){
    const dateparts = date.split('-');
    const year = parseInt(dateparts[0]);
    const month = parseInt(dateparts[1]);
    return new Date(year, month, 0).getDate();
}