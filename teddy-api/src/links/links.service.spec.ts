import { Test, TestingModule } from '@nestjs/testing';
import { LinksService } from './links.service';
import { Link } from './entities/link.entity';
import { Click } from './entities/click.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ShortenDto } from './dto/shorten.dto';
import { IsNull } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockRepo<T extends ObjectLiteral = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
>;

const createMockRepo = (): MockRepo => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  increment: jest.fn(),
  findAndCount: jest.fn(),
  insert: jest.fn(),
});

describe('LinksService', () => {
  let service: LinksService;
  let linksRepo: MockRepo<Link>;
  let clicksRepo: MockRepo<Click>;

  beforeAll(() => {
    process.env.APP_BASE_URL =
      process.env.APP_BASE_URL ?? 'http://localhost:3000';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinksService,
        {
          provide: getRepositoryToken(Link),
          useValue: createMockRepo(),
        },
        {
          provide: getRepositoryToken(Click),
          useValue: createMockRepo(),
        },
      ],
    }).compile();

    service = module.get<LinksService>(LinksService);
    linksRepo = module.get<MockRepo<Link>>(getRepositoryToken(Link));
    clicksRepo = module.get<MockRepo<Click>>(getRepositoryToken(Click));
  });

  describe('shorten', () => {
    it('deve criar um link encurtado associado ao tenant e opcionalmente ao owner', async () => {
      const dto: ShortenDto = {
        originUrl: 'https://example.com/minha/url/grande',
      };
      const tenantId = 1;
      const ownerId = 42;
      const generatedCode = 'ABC123';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      (service as any).generateUniqueCode = jest
        .fn()
        .mockResolvedValue(generatedCode);

      const fakeLink: Partial<Link> = {
        id: 10,
        originUrl: dto.originUrl,
        code: generatedCode,
        clicks: 0,
        ownerId,
        tenantId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      linksRepo.create!.mockReturnValue(fakeLink);
      linksRepo.save!.mockResolvedValue(fakeLink);

      const result = await service.shorten(dto, tenantId, ownerId);

      expect(linksRepo.create).toHaveBeenCalledWith({
        originUrl: dto.originUrl,
        code: generatedCode,
        ownerId,
        tenantId,
      });

      expect(linksRepo.save).toHaveBeenCalledWith(fakeLink);

      expect(result).toEqual({
        id: fakeLink.id,
        code: generatedCode,
        shortUrl: `${process.env.APP_BASE_URL}/${generatedCode}`,
        originUrl: dto.originUrl,
      });
    });
  });

  describe('findByCodeOrFail', () => {
    it('deve retornar o link quando o código existe e não está deletado', async () => {
      const code = 'ABC123';
      const link: Partial<Link> = {
        id: 1,
        code,
        originUrl: 'https://example.com',
      };

      linksRepo.findOne!.mockResolvedValue(link);

      const result = await service.findByCodeOrFail(code);

      expect(linksRepo.findOne).toHaveBeenCalledWith({
        where: { code, deletedAt: IsNull() },
      });

      expect(result).toBe(link);
    });

    it('deve lançar NotFoundException quando o código não existe', async () => {
      const code = 'NAOEXISTE';
      linksRepo.findOne!.mockResolvedValue(null);

      await expect(service.findByCodeOrFail(code)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('registerClick', () => {
    it('deve incrementar o contador de cliques e registrar na tabela clicks', async () => {
      const linkId = 5;

      linksRepo.increment!.mockResolvedValue({});
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      clicksRepo.insert!.mockResolvedValue({} as any);

      await service.registerClick(linkId);

      expect(linksRepo.increment).toHaveBeenCalledWith(
        { id: linkId },
        'clicks',
        1,
      );
      expect(clicksRepo.insert).toHaveBeenCalledWith({ linkId });
    });
  });
});
