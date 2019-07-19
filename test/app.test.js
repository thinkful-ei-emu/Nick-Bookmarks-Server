
const app = require('../src/app');

describe('App', () => {
  it('Get responds with 200 and a list of bookmarks', () => {
    return supertest(app)
      .get('/bookmarks')
      .set({'Authorization': 'Bearer 58bffe62-cef0-417c-860d-f684152335e1'})
      .expect(200)
      .expect('Content-Type', /json/);
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

  it('Should get one bookmark from the /:id path', () => {
    return supertest(app)
      .get('/bookmarks/1')
      .set({'Authorization': 'Bearer 58bffe62-cef0-417c-860d-f684152335e1'})
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('Should delete bookmarks successfully', () => {
    return supertest(app)
      .delete('/bookmarks/1')
      .set({'Authorization': 'Bearer 58bffe62-cef0-417c-860d-f684152335e1'})
      .expect(204);
  });


});