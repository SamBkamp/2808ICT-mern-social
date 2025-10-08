import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from './../../config/config'

const signin = async (req, res) => {
  try {
    let user = await User.findOne({
      "email": req.body.email
    })

    if (!user)
      return res.status('401').json({
        error: "User not found"
      })

    if (!user.authenticate(req.body.password)) {
      return res.status('401').send({
        error: "Email and password don't match."
      })
    }
    const token = jwt.sign({
      _id: user._id
    }, config.jwtSecret_priv, { algorithm: 'RS256' })

    res.cookie("t", token, {
      expire: new Date() + 9999
    })

    return res.json({
      token,
      user: {_id: user._id, name: user.name, email: user.email}
    })
  } catch (err) {
    console.log(err)
    return res.status('401').json({
      error: "Could not sign in"
    })

  }
}

const signout = (req, res) => {
  res.clearCookie("t")
  return res.status('200').json({
    message: "signed out"
  })
}


const requireSignin = expressJwt({
    secret: `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAv4rUJhvsrogsOnTTVQep
jj58zFoY43pJPIbhh3MulAW9TZbbswvwTvmTlEaSKQl6+u+q1EIaOdty8eujMQAN
KSHMqdBWYUmJ7LVBdB6EsyCzvbbMn5TNZlh4JDY+N7acEYgGimfLAUg+ormys0Mg
gdWUkEtJhKSdrAfEu9cg33I5wJRcURh+BeJiEsvfoZnu5KNWs8hkgVwMcqBz32Em
dz81G2TsKx+nbD5XMygmM0zL6Aczuh/QLvDkV3rwJ1NH9X/Q4EUnKQgVbXeDGOLF
teXR9e2qLXom00/K8yBI3jvCJfl/E0eY2jFy5b1srIme2FfJHSQPhrj6jjsWRYit
JBaG8e33bP4mrcp9+kJ1d/mEIjGtsMDVGgs8uG1JxiE0iuifNqvMmaS0UE7QB5RR
vehSLrGYRndNT38TvPkYu3CM2QT3nh7M7kXDPt8EsN/30m26Y1o79ybQqARG+dQM
+/eQxVR7xUoZ76INZ7awx4SLMPY1bRf9QVlVYMF/GO5vNiRWZS6veu5BE2j/1+7q
+E1ysrgOgtZ4hpYbecEHnAhsdjmtNSKzmsxm0xg7/O2vfO4d4TCltctlzNAoId4Z
ESH1BUv31vpXacCN38LpIi+YEZyUWS9KqStir0hV39te5d6OZWbsHIXvQgcjpR6I
uGsAn9zAePW3anL+ukNs38UCAwEAAQ==
-----END PUBLIC KEY-----`,
    userProperty: 'auth',
    algorithms: ["HS256", "RS256"]
})

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id
  if (!(authorized)) {
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization
}
