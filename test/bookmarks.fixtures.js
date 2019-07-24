function makeBookmarksArr(){
  return [
    {
      id: 1,
      title: 'Test book 1',
      url: 'www.bookmarktest1.com',
      description: 'hello',
      rating: 5
    },
    {
      id: 2,
      title: 'Test book 2',
      url: 'www.bookmarktest2.com',
      description: 'goodbye',
      rating: 2
    },
    {
      id: 3,
      title: 'Test book 3',
      url: 'www.bookmarktest3.com',
      description: 'hello goodbye',
      rating: 4
    },
  ];
}

module.exports = makeBookmarksArr;