import { Comment } from "src/comments/entities/comment.entity";
import { Like } from "src/likes/entities/like.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('articles')
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string

    @Column()
    body: string
    
    @ManyToOne(() => User, (user) => user.articles)
    user: User;

    @OneToMany(() => Comment, (comment) => comment.article)
    comments: Comment[];

    @OneToMany(() => Like, (like) => like.article)
    likes: Like[];
}
