from math import ceil
from typing import Optional

from sqlalchemy.orm import Query

from app import schemas


def clamp(n: int, minn: int, maxn: int):
    return max(min(n, maxn), minn)


def with_pagination(
    query: Query,
    page: Optional[int],
    page_size: Optional[int],
    min_page_size=1,
    max_page_size=100,
    default_page_size=10,
):
    page = 1 if page is None or page < 1 else page
    page_size = default_page_size if page_size is None else page_size
    page_size = clamp(
        page_size,
        min_page_size,
        max_page_size,
    )
    item_count = query.count()
    result = query.limit(page_size).offset((page - 1) * page_size).all()
    return schemas.PaginatedResult(
        total_pages=max(1, ceil(item_count / page_size)),
        page=page,
        page_size=page_size,
        result=result,
    )


def singleton(cls):
    instances = {}

    def wrapper(*args, **kwargs):
        if cls not in instances:
            print(f"{cls} instance created")
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]

    return wrapper
