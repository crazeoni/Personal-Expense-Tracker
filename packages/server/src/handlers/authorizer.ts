import type { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda';
import { verifyToken, extractTokenFromHeader } from '../utils/auth';

const generatePolicy = (
  principalId: string,
  effect: 'Allow' | 'Deny',
  resource: string,
  context?: Record<string, string | number | boolean>
): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ],
  },
  context,
});


export const authorizer = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  try {
    const token = extractTokenFromHeader(event.authorizationToken);

    if (!token) {
      throw new Error("No token provided");
    }

    const payload = verifyToken(token);

    return generatePolicy(payload.userId, "Allow", event.methodArn, {
      userId: payload.userId,
      email: payload.email,
    });

  } catch (error) {
    console.error("Authorization failed:", error);
    throw new Error("Unauthorized");
  }
};



// export const authorizer = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
//   try {
//     const token = extractTokenFromHeader(event.authorizationToken);
    
//     if (!token) {
//       throw new Error('No token provided');
//     }
    
//     const payload = verifyToken(token);
    
//     return generatePolicy('user', 'Allow', event.methodArn, {
//       userId: payload.userId,
//       email: payload.email,
//     });
//   } catch (error) {
//     console.error('Authorization failed:', error);
//     throw new Error('Unauthorized');
//   }
// };