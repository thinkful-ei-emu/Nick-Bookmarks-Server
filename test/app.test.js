const BookmarksService = require('../src/bookmarks-service');
const knex = require('knex');
const app = require('../src/app');
const makeBookmarksArr = require('./bookmarks.fixtures');

describe('Bookmarks endpoints', () => {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });

    app.set('db', db);
  });

  before(() => {
    return db('bookmarks').truncate();
  });

  after(() => {
    db.destroy();
  });

  afterEach(() => {
    return db('bookmarks').truncate();
  });

  

  describe('GET endpoints', () => {
    context('Given bookmarks exist', () => {
      const testBookmarks = makeBookmarksArr();
      beforeEach(() => {
        return db
          .insert(testBookmarks)
          .into('bookmarks');
      });
      it('responds 200 with bookmarks', () => {
        return supertest(app)
          .get('/bookmarks')
          .set({'Authorization': 'Bearer 58bffe62-cef0-417c-860d-f684152335e1'})
          .expect(200, testBookmarks)
          .expect('Content-Type', /json/);
      });
      it('should respond 200 with a single bookmark from bookmarks/:id', () => {
        const id = testBookmarks[0].id;
        return supertest(app)
          .get(`/bookmarks/${id}`)
          .set({'Authorization': 'Bearer 58bffe62-cef0-417c-860d-f684152335e1'})
          .expect(200, testBookmarks[0])
          .expect('Content-Type', /json/);
      });
    });
    context('Given no bookmarks exist', () => {
      it('GET /bookmarks should return an empty array', () => {
        return supertest(app)
          .get('/bookmarks')
          .set({'Authorization': 'Bearer 58bffe62-cef0-417c-860d-f684152335e1'})
          .expect(200, []);
      });
      it('GET /bookmarks/:id should return 404', () => {
        return supertest(app)
          .get('/bookmarks/1')
          .set({'Authorization': 'Bearer 58bffe62-cef0-417c-860d-f684152335e1'})
          .expect(404);
      });
    });
  });
});
  


it('Should respond 201 upon successful post', () => {
  return supertest(app)
    .post('/bookmarks')
    .set({'Authorization': 'Bearer 58bffe62-cef0-417c-860d-f684152335e1'})
    .send({
      'name': 'thinkful',
      'rating': '5'
    })
    .expect(201);
});
const required = ['name','rating'];
required.forEach(val => {
  it(`should respond with 400 if no ${val}` , () => {
    let otherVal;
    if(val === 'name'){
      otherVal = {'rating': '2'};
    }else{
      otherVal = {'name': 'nick'};
    }
    return supertest(app)
      .post('/bookmarks')
      .set({'Authorization': 'Bearer 58bffe62-cef0-417c-860d-f684152335e1'})
      .send(otherVal)
      .expect(400, `Need ${val}`);
  });
});

it('Should delete bookmarks successfully', () => {
  return supertest(app)
    .delete('/bookmarks/1')
    .set({'Authorization': 'Bearer 58bffe62-cef0-417c-860d-f684152335e1'})
    .expect(204);
});


