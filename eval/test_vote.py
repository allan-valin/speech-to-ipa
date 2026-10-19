"""Tests for the per-symbol vote. Run: python -m pytest eval/"""
from vote import align, vote


def test_all_agree():
    hyps = {"a": ["p", "a"], "b": ["p", "a"], "c": ["p", "a"]}
    slots = align(hyps, order=["a", "b", "c"])
    out = vote(slots, models=["a", "b", "c"], backbone="a")
    assert out["consensus"] == ["p", "a"]
    assert out["agreed"] == [True, True]


def test_majority_substitution():
    hyps = {"a": ["p", "a"], "b": ["b", "a"], "c": ["b", "a"]}
    out = vote(align(hyps, order=["a", "b", "c"]), models=["a", "b", "c"], backbone="a")
    assert out["consensus"] == ["b", "a"]


def test_insertion_by_one_model_is_dropped():
    hyps = {"a": ["p", "a"], "b": ["p", "x", "a"], "c": ["p", "a"]}
    out = vote(align(hyps, order=["a", "b", "c"]), models=["a", "b", "c"], backbone="a")
    assert out["consensus"] == ["p", "a"]


def test_deletion_by_one_model_is_ignored():
    hyps = {"a": ["p", "a", "t"], "b": ["p", "a"], "c": ["p", "a", "t"]}
    out = vote(align(hyps, order=["a", "b", "c"]), models=["a", "b", "c"], backbone="a")
    assert out["consensus"] == ["p", "a", "t"]


def test_no_majority_falls_back_to_backbone_and_is_flagged():
    hyps = {"a": ["p"], "b": ["b"], "c": ["m"]}
    out = vote(align(hyps, order=["a", "b", "c"]), models=["a", "b", "c"], backbone="a")
    assert out["consensus"] == ["p"]
    assert out["agreed"] == [False]
    assert out["alternatives"][0] == {"p": ["a"], "b": ["b"], "m": ["c"]}


def test_empty_hypothesis():
    hyps = {"a": ["p"], "b": [], "c": ["p"]}
    out = vote(align(hyps, order=["a", "b", "c"]), models=["a", "b", "c"], backbone="a")
    assert out["consensus"] == ["p"]


def test_five_models_need_three():
    m = ["a", "b", "c", "d", "e"]
    hyps = {"a": ["p"], "b": ["p"], "c": ["b"], "d": ["b"], "e": ["m"]}
    out = vote(align(hyps, order=m), models=m, backbone="a")
    assert out["agreed"] == [False]
    assert out["consensus"] == ["p"]
