import { Article } from "src/articles/entities/article.entity";
import { Comment } from "src/comments/entities/comment.entity";
import { Like } from "src/likes/entities/like.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @OneToMany(() => Article, (article) => article.user)
    articles: Article[];

    @OneToMany(() => Like, (like) => like.user)
    likes: Like[];

    // Users that this user is following
    @ManyToMany(() => User, (user) => user.followers)
    @JoinTable({
        name: 'user_followers', // Name of the join table
        joinColumn: {
        name: 'followerId',
        referencedColumnName: 'id',
        },
        inverseJoinColumn: {
        name: 'followingId',
        referencedColumnName: 'id',
        },
    })
    following: User[];

    // Users that follow this user
    @ManyToMany(() => User, (user) => user.following)
    followers: User[];
}
