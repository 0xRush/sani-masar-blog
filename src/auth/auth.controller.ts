import { AuthService } from './auth.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}
    
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body('username') username:string, @Body('password') pass:string) {
        const startTime = Date.now();

        const token = await this.authService.signIn(username, pass);

        const endTime = Date.now();

        const retrievalTime = endTime - startTime;

        return { token, "Retrieval Time":  `${retrievalTime} ms` }
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('register')
    async signUp(@Body('username') username:string, @Body('password') pass:string) {
        return await this.authService.signUp(username, pass);
    }
}
