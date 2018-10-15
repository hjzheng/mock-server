module.exports = {
  '/test-simple01': {
    name: 'hankang',
    age: 12,
    gender: 'male'
  },
  '/test-simple02': {
    GET: {
      messege: 'This is message [get] test-simple02'
    },
    POST: {
      message: 'This is message [post] test-simple02'
    }
  },
  '/test-simple03': {
    get: '这是混合模式test-simple03的get',
    post(req, res) {
      return '这是混合哦是test-simple03的post, 带有高级的req'
    },
    delete(req, res) {
      res.status(500);
      return '这是一个手动的错误，纯属测试'
    }
  },
  '/test-simple05': '这是混合模式test-simple05的简易模式',
  '/test-simple06': [1, 2, 3, 4, 'test-simple05混合数据'],
  '/test-simple07': function() {
    return 'test-simple07测试';
  }
};