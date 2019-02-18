function getDate(){
    const now = new Date();
    const date ={
        year: now.getFullYear(),
        month: (1 + now.getMonth()).toString().padStart(2, '0'),
        day: now.getDate().toString().padStart(2, '0'),
    };
    return `${date.year}-${date.month}-${date.day}`;
}

