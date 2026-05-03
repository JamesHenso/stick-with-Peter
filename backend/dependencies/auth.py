from fastapi import Header, HTTPException
from firebase_admin import auth

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Vui lòng cung cấp token hợp lệ")
    token = authorization.split(" ")[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token    
    except Exception as e:
        print(f"Lỗi xác thực token: {e}")
        raise HTTPException(status_code=401, detail="Token không hợp lệ")