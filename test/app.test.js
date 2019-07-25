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
          .get('/api/bookmarks')
          .set({'Authorization': 'Bearer 58bffe62-cef0-417c-860d-f684152335e1'})
          .expect(200, testBookmarks)
          .expect('Content-Type', /json/);
      });
      it('should respond 200 with a single bookmark from bookmarks/:id', () => {
        const id = testBookmarks[0].id;
        return supertest(app)
          .get(`/api/bookmarks/${id}`)
          .set({'Authorization': 'Bearer 58bffe62-cef0-417c-860d-f684152335e1'})
          .expect(200, testBookmarks[0])
          .expect('Content-Type', /json/);
      });
    });
    context('Given no bookmarks exist', () => {
      it('GET /api/bookmarks should return an empty array', () => {
        return supertest(app)
          .get('/api/bookmarks')
          .set({'Authorization': 'Bearer 58bffe62-cef0-417c-860d-f684152335e1'})
          .expect(200, []);
      });
      it('GET /api/bookmarks/:id should return 404', () => {
        return supertest(app)
          .get('/api/bookmarks/1')
          .set({'Authorization': 'Bearer 58bffe62-cef0-417c-860d-f684152335e1'})
          .expect(404);
      });
    });
  });
  describe('DELETE method', () => {
    const testBookmarks = makeBookmarksArr();
    beforeEach(() => {
      return db
        .insert(testBookmarks)
        .into('bookmarks');
    });
    it('DELETE /api/bookmarks/:id should return 204', () => {
      return supertest(app)
        .delete('/api/bookmarks/1')
        .set({'Authorization': 'Bearer 58bffe62-cef0-417c-860d-f684152335e1'})
        .expect(204);
    });
  });
  describe('POST method', () => {
    it('Should respond 201 with the id and location of new bookmark (happy case)', () => {
      const newBookmark = {
        title: 'Test Post',
        url: 'www.testpost.com',
        rating: 5
      };
      return supertest(app)
        .post('/api/bookmarks')
        .set({'Authorization': 'Bearer 58bffe62-cef0-417c-860d-f684152335e1'})
        .send(newBookmark)
        .expect(201)
        .then(res => {
          expect(res.body.title).to.eql(newBookmark.title);
          expect(res.body.url).to.eql(newBookmark.url);
          expect(res.body.rating).to.eql(newBookmark.rating);
          expect(res.body).to.have.property('id');
          expect(res.body.description).to.eql(null);
          expect(res.headers.location).to.eql(`/${res.body.id}`);
        });
    });
    const requiredVals = ['title', 'url', 'rating'];
    requiredVals.forEach(val => {
      const newBookmark = {
        title: 'test',
        url: 'www.test.com',
        rating: 5
      };
      it(`Should send 400 status if ${val} not entered`, () => {
        delete newBookmark[val];
        return supertest(app)
          .post('/api/bookmarks')
          .set({'Authorization': 'Bearer 58bffe62-cef0-417c-860d-f684152335e1'})
          .send(newBookmark)
          .expect(400);
      });
    });
    
  });
});
  

