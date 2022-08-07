import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    const user = req.user as User;
    return this.projectsService.create(createProjectDto, user);
  }

  @Get()
  findAll(@Req() req) {
    const user = req.user as User;
    return this.projectsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: number, @Req() req) {
    const user = req.user as User;
    return this.projectsService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req,
  ) {
    const user = req.user as User;
    return this.projectsService.update(id, updateProjectDto, user);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number, @Req() req) {
    const user = req.user as User;
    return this.projectsService.remove(id, user);
  }
}
