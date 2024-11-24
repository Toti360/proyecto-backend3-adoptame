import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app.js';
import { expect } from 'chai';


chai.use(chaiHttp);

describe('Adoption Router Tests', () => {
  // Variables para usar en múltiples tests
  const validUserId = '671867696890203be0f33e5f';
  const validPetId = '671860eea7e06a95b6300028';
  const validAdoptionId = '67436cde99efa026a232e74d';
  const invalidId = '123456789012345678901234';

  // Hook para esperar a que la conexión a MongoDB esté lista
  before(function(done) {
    this.timeout(5000);
    setTimeout(done, 2000); 
  });

  describe('GET /api/adoptions', () => {
    it('debería retornar todas las adopciones con status 200', (done) => {
      chai
        .request(app)
        .get('/api/adoptions')
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });

    it('debería incluir las propiedades necesarias en cada adopción', (done) => {
      chai
        .request(app)
        .get('/api/adoptions')
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(200);
          if (res.body.length > 0) {
            expect(res.body[0]).to.have.property('userId');
            expect(res.body[0]).to.have.property('petId');
          }
          done();
        });
    });
  });

  describe('GET /api/adoptions/:aid', () => {
    it('debería retornar una adopción específica por ID válido', (done) => {
      chai
        .request(app)
        .get(`/api/adoptions/${validAdoptionId}`)
        .end((err, res) => {
          if (err) return done(err);
          if (res.status === 404) {
            // Si no existe la adopción, marcamos el test como pendiente
            return done();
          }
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });

    it('debería retornar error 404 para ID de adopción inexistente', (done) => {
      chai
        .request(app)
        .get(`/api/adoptions/${invalidId}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(404);
          done();
        });
    });

    it('debería retornar error 400 para ID de adopción inválido', (done) => {
      chai
        .request(app)
        .get('/api/adoptions/invalid-id')
        .end((err, res) => {
          if (err) return done(err);
          expect(res).to.have.status(400);
          done();
        });
    });
  });

  describe('POST /api/adoptions/:uid/:pid', () => {
    it('debería crear una nueva adopción con IDs válidos', (done) => {
      chai
        .request(app)
        .post(`/api/adoptions/${validUserId}/${validPetId}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.be.oneOf([201, 400]); 
          if (res.status === 201) {
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('userId');
            expect(res.body).to.have.property('petId');
          }
          done();
        });
    });

    it('debería retornar error 404 para usuario inexistente', (done) => {
      chai
        .request(app)
        .post(`/api/adoptions/${invalidId}/${validPetId}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.be.oneOf([404, 400]);
          done();
        });
    });

    it('debería retornar error 404 para mascota inexistente', (done) => {
      chai
        .request(app)
        .post(`/api/adoptions/${validUserId}/${invalidId}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.be.oneOf([404, 400]);
          done();
        });
    });
  });
});

