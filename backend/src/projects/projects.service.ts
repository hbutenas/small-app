import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, user: User) {
    return await this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        description: createProjectDto.description,
        userId: user.id,
      },
    });
  }

  async findAll(user: User) {
    return await this.prisma.project.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  async findOne(id: number, user: User) {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!project || project.userId !== user.id) throw new NotFoundException();
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, user: User) {
    await this.findOne(id, user);
    return await this.prisma.project.update({
      where: {
        id,
      },
      data: {
        name: updateProjectDto.name,
        description: updateProjectDto.description,
      },
    });
  }

  async remove(id: number, user: User) {
    await this.findOne(id, user);
    return await this.prisma.project.delete({
      where: {
        id,
      },
    });
  }
}
