import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    // this function is responsible for registering the user
    async signUp(username:string, pass:string) {
        const hashedPassword = await this.hashPassword(pass);

        const user = await this.usersService.createuser(username, hashedPassword);

        return await this.createToken(user);
    }

    // this function is responsible for logining the user
    async signIn(username:string, pass:string) {
        const user = await this.usersService.findOneByUsername(username);

        if (await !this.comparePasswords(user.password, pass)) {
            throw new UnauthorizedException();
        }

        return await this.createToken(user);
    }

    // this function hashing the plain password and return it
    async hashPassword(password:string): Promise<string> {
        const saltRounds = 10; // Number of salt rounds for hashing
        return await bcrypt.hash(password, saltRounds);
    }
    
    // this method takes the hashed password that stored in the db and compare it with the request password
    // it returns true if they are the same and false if they are not
    async comparePasswords(hashedPassword:string, plainPassword:string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // this function takes the user as parameter and create JWT token from it's id and user name also a secret key
    async createToken(user) {
        const payload = { sub: user.id, username: user.username };

        const access_token = await this.jwtService.signAsync(payload);

        return access_token;
    }
}
